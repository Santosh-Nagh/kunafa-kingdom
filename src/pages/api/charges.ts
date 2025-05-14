// src/pages/api/charges.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const charges = await prisma.charge.findMany({
        orderBy: { name: 'asc' },
      });
      return res.status(200).json(charges);
    } catch (error) {
      console.error('GET /api/charges error', error);
      return res.status(500).json({ error: 'Failed to fetch charges.' });
    }
  }
  res.setHeader('Allow', ['GET']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
