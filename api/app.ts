import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes';
import equipmentRoutes from './routes/equipmentRoutes';
import reservationRoutes from './routes/reservationRoutes';
import userRoutes from './routes/userRoutes';
import auditRoutes from './routes/auditRoutes';
import contentRoutes from './routes/contentRoutes';

export function createApiApp(): express.Express {
  const app = express();

  // Trust reverse proxies (Cloudflare, Cloud Run, Nginx) for accurate client IP detection
  app.set('trust proxy', true);

  // Basic security and parsing middlewares
  app.use(cors({
    origin: true,
    credentials: true
  }));
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true, limit: '2mb' }));
  app.use(cookieParser());

  // Disable x-powered-by for security
  app.disable('x-powered-by');

  // Security Headers
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'healthy',
      system: 'ARIF Laboratory Inventory & Reservation System',
      version: '2.0.0',
      timestamp: new Date().toISOString()
    });
  });

  // Mount API Routers
  app.use('/api/auth', authRoutes);
  app.use('/api/equipment', equipmentRoutes);
  app.use('/api/reservations', reservationRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/audit-logs', auditRoutes);
  app.use('/api/stats', auditRoutes);
  app.use('/api/content', contentRoutes);

  // Fallback 404 for unmatched API routes
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

  // Global error handler ensuring JSON is always returned
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Unhandled API Server Error:', err);
    if (res.headersSent) {
      return next(err);
    }
    res.status(err.status || 500).json({
      success: false,
      error: err.message || 'An unexpected internal server error occurred.'
    });
  });

  return app;
}

export const apiApp = createApiApp();
