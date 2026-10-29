import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.routes.js';

const app = express();

// Allowed origins configuration (FRONTEND_URL admite varios separados por coma)
const origenesLocales = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173'
];

function obtenerOrigenesPermitidos() {
  const configurados = [process.env.FRONTEND_URLS, process.env.FRONTEND_URL]
    .filter(Boolean)
    .join(',')
    .split(',')
    .map((url) => url.trim().replace(/\/+$/, ''))
    .filter(Boolean);

  if (configurados.length === 0) {
    configurados.push('https://truextrade.vercel.app');
  }

  return new Set([...configurados, ...origenesLocales]);
}

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or Postman)
      if (!origin) return callback(null, true);

      const limpio = origin.replace(/\/+$/, '');
      if (obtenerOrigenesPermitidos().has(limpio)) {
        return callback(null, true);
      }

      console.warn(`[CORS] Origen no permitido: ${origin}`);
      return callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Truex Trade API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// API health endpoint
const ESTADOS_DB = ['disconnected', 'connected', 'connecting', 'disconnecting'];

app.get('/api/health', (req, res) => {
  const estadoDb = ESTADOS_DB[mongoose.connection.readyState] ?? 'unknown';

  res.status(200).json({
    status: 'OK',
    database: estadoDb,
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Auth routes
app.use('/api/auth', authRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    mensaje: `No existe la ruta ${req.method} ${req.originalUrl}`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Server Error]:', err.stack || err.message);
  res.status(err.status || 500).json({
    error: 'Internal Server Error',
    mensaje: err.message || 'Ocurrió un error inesperado en el servidor.'
  });
});

export default app;
