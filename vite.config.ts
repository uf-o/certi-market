import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    {
      name: 'mock-actions-api',
      configureServer(server) {
        const mockRecords: any[] = [];
        server.middlewares.use((req, res, next) => {
          if (req.url === '/actions' && req.method === 'POST') {
            let body = '';
            req.on('data', (chunk) => {
              body += chunk;
            });
            req.on('end', () => {
              try {
                const data = JSON.parse(body);
                if (data.action === 'records.list') {
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ ok: true, data: { records: mockRecords } }));
                  return;
                }
                if (data.action === 'records.create') {
                  const record = { id: 'rec_' + Date.now(), value: data.args.value };
                  mockRecords.push(record);
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ ok: true, data: { record } }));
                  return;
                }
              } catch (e) {
                // fall through
              }
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ ok: true }));
            });
            return;
          }
          next();
        });
      },
    },
  ],
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
});
