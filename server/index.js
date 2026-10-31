import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase } from './db/db.js';
import customerRoutes from './routes/customerRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Brightloop Subscription Management API',
    timestamp: new Date().toISOString(),
  });
});

// Mount Customer & User Routes
app.use('/api/customer', customerRoutes);
app.use('/api/user', customerRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Server Error]:', err);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: err.message,
  });
});

// Initialize database and start HTTP server
async function startServer() {
  await initializeDatabase();

  const server = app.listen(PORT, () => {
    console.log(`[Express API] Server running on http://localhost:${PORT}`);
  });

  return server;
}

startServer().catch((err) => {
  console.error('[Server Startup Failed]:', err);
});

export default app;
