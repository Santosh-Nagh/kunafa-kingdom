// src/pages/api/stores.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const stores = await prisma.store.findMany({
        orderBy: { name: 'asc' },
      });
      return res.status(200).json(stores);
    } catch (error) {
      console.error('GET /api/stores error', error);
      return res.status(500).json({ error: 'Failed to fetch stores.' });
    }
  }
  res.setHeader('Allow', ['GET']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
