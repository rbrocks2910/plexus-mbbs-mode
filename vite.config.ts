import { defineConfig, loadEnv, Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'

function apiDevServerPlugin(): Plugin {
  return {
    name: 'api-dev-server',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.startsWith('/api/')) {
          return next();
        }

        const urlPath = req.url.split('?')[0];
        const routeName = urlPath.replace('/api/', '').trim();
        const filePath = path.resolve(__dirname, `api/${routeName}.ts`);

        if (!fs.existsSync(filePath)) {
          return next();
        }

        try {
          // Collect body for POST/PUT requests
          let body: any = undefined;
          if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
            const chunks: Buffer[] = [];
            for await (const chunk of req) {
              chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
            }
            const rawBody = Buffer.concat(chunks).toString('utf-8');
            if (rawBody) {
              try {
                body = JSON.parse(rawBody);
              } catch {
                body = rawBody;
              }
            }
          }

          // Build request wrapper matching VercelRequest
          const reqWrapped: any = req;
          reqWrapped.body = body;
          reqWrapped.query = Object.fromEntries(new URL(req.url, 'http://localhost').searchParams);
          reqWrapped.cookies = {};

          // Build response wrapper matching VercelResponse
          const resWrapped: any = res;
          resWrapped.status = (statusCode: number) => {
            res.statusCode = statusCode;
            return resWrapped;
          };
          resWrapped.json = (data: any) => {
            if (!res.headersSent) {
              res.setHeader('Content-Type', 'application/json');
            }
            res.end(JSON.stringify(data));
            return resWrapped;
          };
          resWrapped.send = (data: any) => {
            res.end(data);
            return resWrapped;
          };

          // Load TypeScript module using Vite's SSR runtime
          const mod = await server.ssrLoadModule(`/api/${routeName}.ts`);
          const handler = mod.default;

          if (typeof handler === 'function') {
            await handler(reqWrapped, resWrapped);
          } else {
            res.statusCode = 404;
            res.end(JSON.stringify({ error: `Handler function in /api/${routeName}.ts not found` }));
          }
        } catch (err: any) {
          console.error(`[API Dev Server Error] ${req.url}:`, err);
          if (!res.writableEnded) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message || 'Internal Server Error' }));
          }
        }
      });
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables from .env into process.env for API handlers
  const env = loadEnv(mode, process.cwd(), '');
  Object.assign(process.env, env);

  return {
    plugins: [react(), apiDevServerPlugin()],
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'router-vendor': ['react-router-dom'],
          }
        }
      }
    }
  };
});
