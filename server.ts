import path from 'path';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import { apiApp } from './api/app';

const PORT = 3000;

async function startServer() {
  const app = express();

  // Mount API application FIRST
  app.use(apiApp);

  // Catch-all to ensure unmatched /api routes never fall through to static or return 405
  app.all('/api', (req, res) => {
    res.status(404).json({
      success: false,
      error: `API route ${req.method} ${req.originalUrl} not found.`
    });
  });

  app.all('/api/*all', (req, res) => {
    res.status(404).json({
      success: false,
      error: `API route ${req.method} ${req.originalUrl} not found.`
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));

    // Fallback to index.html for SPA client-side routing (GET/HEAD only)
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Any other method on unhandled routes returns JSON 404 instead of 405
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      error: `Cannot ${req.method} ${req.originalUrl}`
    });
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ARIF Laboratory Server running on http://localhost:${PORT}`);
  });
}

startServer();
