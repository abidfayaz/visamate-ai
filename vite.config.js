import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Dev-only: serve /api/copilot through the same handler Vercel runs in
// production, so `npm run dev` works without the Vercel CLI. GROQ_API_KEY is
// read from .env on the server side; it has no VITE_ prefix, so Vite never
// exposes it to the browser bundle.
function localApi(env) {
  return {
    name: 'visamate-local-api',
    configureServer(server) {
      server.middlewares.use('/api/copilot', async (req, res) => {
        if (env.GROQ_API_KEY) process.env.GROQ_API_KEY = env.GROQ_API_KEY

        const chunks = []
        for await (const chunk of req) chunks.push(chunk)
        const raw = Buffer.concat(chunks).toString('utf8')
        try {
          req.body = raw ? JSON.parse(raw) : undefined
        } catch {
          req.body = undefined
        }

        res.status = (code) => {
          res.statusCode = code
          return res
        }
        res.json = (payload) => {
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(payload))
        }

        try {
          const { default: handler } = await server.ssrLoadModule('/api/copilot.js')
          await handler(req, res)
        } catch {
          res.status(500).json({ error: 'unavailable' })
        }
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), localApi(env)],
  }
})
