import type { Plugin } from 'vite'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { TRACE_EVENTS, MOCK_RESPONSE, MOCK_DASHBOARD } from '../api/_lib/mockData'

function sendSse(res: ServerResponse, data: unknown) {
  res.write(`data: ${JSON.stringify(data)}\n\n`)
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', (chunk) => { body += chunk })
    req.on('end', () => resolve(body))
    req.on('error', reject)
  })
}

export function mockApiPlugin(): Plugin {
  return {
    name: 'vaic-mock-api',
    configureServer(server) {
      server.middlewares.use('/api/mock-dashboard', (req, res) => {
        if (req.method !== 'GET') {
          res.statusCode = 405
          res.end('Method Not Allowed')
          return
        }
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(MOCK_DASHBOARD))
      })

      server.middlewares.use('/api/mock-trace', (req, res) => {
        if (req.method !== 'GET') {
          res.statusCode = 405
          res.end('Method Not Allowed')
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
      })

      server.middlewares.use('/api/mock-inference', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end('Method Not Allowed')
          return
        }

        const body = await readBody(req)
        let prompt = ''
        try {
          prompt = JSON.parse(body).prompt ?? ''
        } catch {
          prompt = body
        }

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
      })
    },
  }
}
