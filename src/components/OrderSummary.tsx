// src/components/OrderSummary.tsx

import React from 'react';
import { useOrder } from '../context/OrderContext';

export default function OrderSummary() {
  const { state, dispatch } = useOrder();

  const subtotal = state.items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  const taxableCharges = state.charges.filter(c => c.isTaxable).reduce((sum, c) => sum + c.amount, 0);
  const nonTaxableCharges = state.charges.filter(c => !c.isTaxable).reduce((sum, c) => sum + c.amount, 0);
  const taxableAmount = subtotal - state.discount + taxableCharges;
  const cgst = parseFloat((taxableAmount * 0.09).toFixed(2));
  const sgst = parseFloat((taxableAmount * 0.09).toFixed(2));
  const total = parseFloat((taxableAmount + cgst + sgst + nonTaxableCharges).toFixed(2));

  return (
    <div className="border p-4 rounded shadow bg-white">
      <h3 className="font-bold text-lg mb-3">Order Summary</h3>
      {state.items.map(item => (
        <div key={item.variantId} className="flex justify-between text-sm mb-1">
          <div>
            {item.productName} ({item.variantName}) × {item.quantity}
          </div>
          <div>₹{item.unitPrice * item.quantity}</div>
        </div>
      ))}

      {state.charges.map(charge => (
        <div key={charge.chargeId} className="flex justify-between text-sm text-gray-600">
          <div>{charge.name}</div>
          <div>₹{charge.amount}</div>
        </div>
      ))}

      <div className="flex justify-between mt-2 border-t pt-2">
        <span className="font-medium">Subtotal</span>
        <span>₹{subtotal}</span>
      </div>
      <div className="flex justify-between text-sm text-gray-500">
        <span>Discount</span>
        <span>- ₹{state.discount}</span>
      </div>
      <div className="flex justify-between text-sm text-gray-500">
        <span>Taxable Charges</span>
        <span>₹{taxableCharges}</span>
      </div>
      <div className="flex justify-between text-sm text-gray-500">
        <span>CGST (9%)</span>
        <span>₹{cgst}</span>
      </div>
      <div className="flex justify-between text-sm text-gray-500">
        <span>SGST (9%)</span>
        <span>₹{sgst}</span>
      </div>
      <div className="flex justify-between text-sm text-gray-500">
        <span>Non-Taxable Charges</span>
        <span>₹{nonTaxableCharges}</span>
      </div>
      <div className="flex justify-between font-bold text-lg mt-3">
        <span>Total</span>
        <span>₹{total}</span>
      </div>
    </div>
  );
}
