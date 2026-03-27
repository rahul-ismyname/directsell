import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createClient } from "@libsql/client";
import { QUERIES } from '../src/db/queries.js';
import { z } from 'zod';

dotenv.config();

// ESM __dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Fix for BigInt serialization in JSON
BigInt.prototype.toJSON = function() {
  return this.toString();
};

const app = express();
const PORT = process.env.PORT || 3001;

// --- PRODUCTION ENVIRONMENT VALIDATION ---
const REQUIRED_ENV = ['JWT_SECRET', 'VITE_TURSO_URL', 'VITE_TURSO_TOKEN'];
const missingEnv = REQUIRED_ENV.filter(key => !process.env[key]);

if (missingEnv.length > 0) {
  // Use a proper JSON error instead of crashing in serverless
  app.use('/api/*', (req, res) => {
    res.status(500).json({ 
       error: 'CONFIGURATION ERROR', 
       missing: missingEnv,
       message: 'Database or JWT credentials are not set in Vercel settings.'
    });
  });
}

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-startup';
const client = createClient({
  url: process.env.VITE_TURSO_URL || '',
  authToken: process.env.VITE_TURSO_TOKEN || '',
});

// Basic logging for every request
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Security & Production Middleware
app.use(helmet({
  contentSecurityPolicy: false,
}));
app.use(compression());
app.use(cors());
app.use(express.json());

// Diagnostic Health Check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'online', 
        time: new Date().toISOString(),
        database_configured: !!process.env.VITE_TURSO_URL,
        node_version: process.version
    });
});

// --- VALIDATION SCHEMAS ---
const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['Verified Collector', 'Seller', 'Supplier', 'Distributor']).optional(),
  location: z.string().optional()
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Authentication required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token is invalid or expired' });
    req.user = user;
    next();
  });
};

// --- AUTH ENDPOINTS ---

app.post('/api/auth/register', async (req, res) => {
  const result = registerSchema.safeParse(req.body);
  if (!result.success) return res.status(400).json({ error: result.error.errors[0].message });
  const { name, email, password, role } = result.data;

  try {
    const existing = await client.execute({
      sql: QUERIES.GET_USER_SAFE,
      args: [email]
    });

    if (existing.rows.length > 0) return res.status(400).json({ error: 'User already exists' });

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const id = `user_${Date.now()}`;
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await client.execute({
      sql: QUERIES.REGISTER_USER,
      args: [id, name, email, hashedPassword, role || 'Verified Collector', code, result.data.location || 'Mumbai']
    });

    res.json({ success: true, message: 'User registered.', id, code });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ error: 'Database error while registering user.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) return res.status(400).json({ error: "Invalid login format" });
  
  const { email, password } = result.data;
  try {
    const result = await client.execute({
      sql: QUERIES.GET_USER_SAFE,
      args: [email]
    });

    if (result.rows.length === 0) return res.status(401).json({ error: 'User not found' });

    const user = result.rows[0];
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, is_verified: user.is_verified === 1 } });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ error: 'Database connection failed.' });
  }
});

// Products
app.get('/api/products', async (req, res) => {
  try {
    const result = await client.execute(QUERIES.GET_ALL_PRODUCTS);
    res.json({ rows: result.rows });
  } catch (error) {
    console.error("PRODUCTS FETCH ERROR:", error);
    res.status(500).json({ error: 'Unable to fetch products from database.' });
  }
});

// ... other routes can be added later as needed ...

// General Error handling
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);
  res.status(500).json({ error: 'Something went wrong on the server.' });
});

export default app;
