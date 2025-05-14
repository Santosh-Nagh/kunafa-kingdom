// src/pages/api/stores.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const stores = await prisma.store.findMany({
      orderBy: { name: 'asc' },
    });
    res.status(200).json(stores);
  } catch (error) {
    console.error('API /stores error:', error);
    res.status(500).json({ error: 'Failed to load stores' });
  }
}
