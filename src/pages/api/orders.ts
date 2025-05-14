// src/pages/api/orders.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { prisma } from '../../../lib/prisma';

const createOrderSchema = z.object({
  storeId: z.string().uuid(),
  items: z.array(
    z.object({
      variantId: z.string().uuid(),
      quantity: z.number().int().positive(),
      unit_price: z.number().positive(),
    })
  ),
  applied_charges: z.array(
    z.object({
      chargeId: z.string().uuid(),
      amount_charged: z.number().nonnegative(),
    })
  ),
  discount_amount: z.number().nonnegative().optional(),
  payment_method: z.string(),
  amount_received: z.number().nonnegative().optional(),
  customer_name: z.string().optional(),
  customer_phone: z.string().optional(),
  aggregator_id: z.string().optional(),
  notes: z.string().optional(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  try {
    const payload = createOrderSchema.parse(req.body);
    const {
      storeId,
      items,
      applied_charges,
      discount_amount = 0,
      payment_method,
      amount_received,
      customer_name,
      customer_phone,
      aggregator_id,
      notes,
    } = payload;

    // 1) Calculate subtotal and prepare items data
    let subtotal = 0;
    const orderItemsData = items.map((item) => {
      const total_price = item.unit_price * item.quantity;
      subtotal += total_price;
      return {
        variantId: item.variantId,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price,
      };
    });

    // 2) Calculate charge totals by taxability
    let taxableChargesTotal = 0;
    let nonTaxableChargesTotal = 0;
    for (const ac of applied_charges) {
      const dbCharge = await prisma.charge.findUnique({ where: { id: ac.chargeId } });
      if (!dbCharge) throw new Error(`Invalid charge ID: ${ac.chargeId}`);
      if (dbCharge.is_taxable) taxableChargesTotal += ac.amount_charged;
      else nonTaxableChargesTotal += ac.amount_charged;
    }

    // 3) Compute taxes & total
    const taxableAmount = subtotal - discount_amount + taxableChargesTotal;
    const cgst_amount = parseFloat((taxableAmount * 0.09).toFixed(2));
    const sgst_amount = parseFloat((taxableAmount * 0.09).toFixed(2));
    const total_amount = parseFloat(
      (taxableAmount + cgst_amount + sgst_amount + nonTaxableChargesTotal).toFixed(2)
    );

    // 4) Determine payment status & change
    let payment_status = 'Pending';
    let change_given: number | null = null;
    if (payment_method.toLowerCase() === 'cash') {
      if (amount_received === undefined) {
        return res.status(400).json({ error: 'Cash payments require amount_received.' });
      }
      if (amount_received < total_amount) {
        return res.status(400).json({ error: 'Insufficient cash provided.' });
      }
      payment_status = 'Paid';
      change_given = parseFloat((amount_received - total_amount).toFixed(2));
    } else {
      payment_status = 'Paid';
    }

    // 5) Transaction: decrement inventory, create order + relations
    const newOrder = await prisma.$transaction(async (tx) => {
      // a) Update inventory for each item
      for (const item of items) {
        const updateResult = await tx.inventory.updateMany({
          where: {
            variantId: item.variantId,
            storeId: storeId,
            quantity: { gte: item.quantity },
          },
          data: { quantity: { decrement: item.quantity } },
        });
        if (updateResult.count === 0) {
          throw new Error(`Insufficient stock for variant ${item.variantId}`);
        }
      }

      // b) Create the Order record
      return tx.order.create({
        data: {
          storeId,
          customer_name,
          customer_phone,
          aggregator_id,
          subtotal,
          applied_charges_amount_taxable: taxableChargesTotal,
          applied_charges_amount_nontaxable: nonTaxableChargesTotal,
          discount_amount,
          taxable_amount: taxableAmount,
          cgst_amount,
          sgst_amount,
          total_amount,
          payment_method,
          amount_received,
          change_given,
          payment_status,
          notes,
          items: {
            create: orderItemsData,
          },
          applied_charges: {
            create: applied_charges.map((ac) => ({
              chargeId: ac.chargeId,
              amount_charged: ac.amount_charged,
            })),
          },
        },
        include: {
          items: true,
          applied_charges: true,
        },
      });
    });

    return res.status(201).json(newOrder);
  } catch (error: any) {
    console.error('POST /api/orders error', error);
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Invalid input', details: error.issues });
    }
    return res.status(500).json({ error: error.message || 'Failed to create order.' });
  }
}
