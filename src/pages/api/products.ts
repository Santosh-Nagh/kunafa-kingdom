// src/pages/api/products.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const products = await prisma.product.findMany({
        where: { is_active: true },
        include: {
          variants: true,
          category: true,
        },
        orderBy: [
          { category: { name: 'asc' } },
          { name: 'asc' },
        ],
      });
      return res.status(200).json(products);
    } catch (error) {
      console.error('GET /api/products error', error);
      return res.status(500).json({ error: 'Failed to fetch products.' });
    }
  }
  res.setHeader('Allow', ['GET']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
