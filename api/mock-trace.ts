import type { VercelRequest, VercelResponse } from '@vercel/node'
import { TRACE_EVENTS } from './_lib/mockData.js'

export const config = { runtime: 'nodejs' }

function sendSse(res: VercelResponse, data: unknown) {
  res.write(`data: ${JSON.stringify(data)}\n\n`)
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.status(405).send('Method Not Allowed')
    return
  }

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.flushHeaders()

  let index = 0
  const interval = setInterval(() => {
    if (index >= TRACE_EVENTS.length) {
      clearInterval(interval)
      res.end()
      return
    }
    const event = { ...TRACE_EVENTS[index], id: String(index + 1), timestamp: Date.now() }
    sendSse(res, event)
    index++
  }, 800)

  req.on('close', () => clearInterval(interval))
}
