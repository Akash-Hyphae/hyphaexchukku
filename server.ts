import express from 'express';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { connectMongoDB } from './server/config/db.ts';
import authRoutes from './server/routes/authRoutes.ts';
import publicRoutes from './server/routes/publicRoutes.ts';
import adminRoutes from './server/routes/adminRoutes.ts';
import vaultRoutes from './server/routes/vaultRoutes.ts';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Core Middlewares
app.use(cors({
  origin: (process.env.CLIENT_URL ? [process.env.CLIENT_URL, true] : true) as any,
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// Static Uploads and Public Asset Folders
const uploadsDir = path.resolve(process.cwd(), 'public', 'uploads');
const photosDir = path.resolve(process.cwd(), 'public', 'photos');
app.use('/uploads', express.static(uploadsDir));
app.use('/photos', express.static(photosDir));

// Connect Database (MongoDB Atlas or embedded JSON store fallback)
connectMongoDB();

// Mount API Endpoints
app.use('/api/auth', authRoutes);

// Public APIs (Strictly filtered, no private data)
app.use('/api/public', publicRoutes);
app.use('/api', publicRoutes); // handles /api/gallery, /api/timeline, etc.

// Admin Vault APIs (Require valid JWT Admin Auth)
app.use('/api/admin/private', vaultRoutes);

// Admin CMS APIs (Require valid JWT Admin Auth)
app.use('/api/admin', adminRoutes);

// Health Endpoint
app.get('/api/health', (_req, expressRes) => {
  expressRes.json({
    status: 'ok',
    app: 'CHUKKU × HYPHAE',
    timestamp: new Date().toISOString()
  });
});

// Setup Frontend serving (Vite middlewares in dev, static files in prod)
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {}
      },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`✨ Chukku × Hyphae Romantic Server is running on port ${PORT}`);
    console.log(`🔒 Private Admin Vault protected at /admin/private`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
