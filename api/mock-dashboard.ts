import type { VercelRequest, VercelResponse } from '@vercel/node'
import { MOCK_DASHBOARD } from './_lib/mockData.js'

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.status(405).send('Method Not Allowed')
    return
  }

  res.status(200).json(MOCK_DASHBOARD)
}
