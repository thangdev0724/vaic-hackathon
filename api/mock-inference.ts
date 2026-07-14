import type { VercelRequest, VercelResponse } from '@vercel/node'
import { MOCK_RESPONSE } from './_lib/mockData.js'

export const config = { runtime: 'nodejs' }

function sendSse(res: VercelResponse, data: unknown) {
  res.write(`data: ${JSON.stringify(data)}\n\n`)
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed')
    return
  }

  const prompt: string = typeof req.body?.prompt === 'string' ? req.body.prompt : ''

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.flushHeaders()

  const prefix = prompt ? `Response to: "${prompt.slice(0, 50)}${prompt.length > 50 ? '...' : ''}"\n\n` : ''
  const text = prefix + MOCK_RESPONSE
  const words = text.split(' ')
  let i = 0

  const interval = setInterval(() => {
    if (i >= words.length) {
      sendSse(res, { type: 'done' })
      clearInterval(interval)
      res.end()
      return
    }
    const token = (i === 0 ? '' : ' ') + words[i]
    sendSse(res, { type: 'token', token })
    i++
  }, 60)

  req.on('close', () => clearInterval(interval))
}
