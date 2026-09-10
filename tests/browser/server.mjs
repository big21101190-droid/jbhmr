// Isolated component harness; never creates a production route or touches Blobs.
import { createServer } from 'vite';
import { resolve } from 'node:path';
const server = await createServer({
  configFile: false,
  resolve: { alias: { '@': resolve('.') } },
  define: { 'process.env': '{}' },
  oxc: { jsx: { runtime: 'automatic' } },
  server: { host: '127.0.0.1', port: 4178, strictPort: true },
});
await server.listen();
