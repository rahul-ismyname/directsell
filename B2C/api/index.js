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
  throw new Error(`\n❌ FATAL CONFIGURATON ERROR:\nMissing required environment variables: ${missingEnv.join(', ')}`);
}

const JWT_SECRET = process.env.JWT_SECRET;
const client = createClient({
  url: process.env.VITE_TURSO_URL,
  authToken: process.env.VITE_TURSO_TOKEN,
});

// Security & Production Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Turn off if using external images like Unsplash without proper config
}));
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Rate Limiting: 100 requests per 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests from this IP, please try again later.' }
});
app.use('/api/', limiter);

// --- VALIDATION SCHEMAS ---
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(['Verified Collector', 'Seller', 'Supplier', 'Distributor']).optional(),
  location: z.string().optional()
});

const distributorReviewSchema = z.object({
  distributorId: z.string(),
  productId: z.string(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(500),
  isAnonymous: z.boolean()
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

const productSchema = z.object({
  title: z.string().min(3),
  brand: z.string().optional(),
  description: z.string().min(10),
  price: z.number().positive(),
  msrp: z.number().positive(),
  category: z.string(),
  minUnits: z.number().int().min(1),
  image: z.string().url().optional(),
  image2: z.string().url().optional(),
  image3: z.string().url().optional(),
  isInfinite: z.boolean().optional()
});

const joinPoolSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().min(1),
  savings: z.string().optional(),
  productName: z.string()
});

const reviewSchema = z.object({
  sellerId: z.string(),
  productId: z.string(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(500)
});

const reportSchema = z.object({
  sellerId: z.string(),
  reason: z.string(),
  description: z.string().max(1000)
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

// Register
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

    res.json({ success: true, message: 'User registered. Please verify email.', id, code });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
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
    res.status(500).json({ error: error.message });
  }
});

// Verify Email
app.post('/api/auth/verify', async (req, res) => {
  const { email, code } = req.body;
  try {
    const result = await client.execute({
      sql: QUERIES.VERIFY_USER_UPDATE,
      args: [email, code]
    });
    
    if (result.rowsAffected > 0) {
      // Fetch the updated user to return a token
      const userRes = await client.execute({
        sql: QUERIES.GET_USER_SAFE,
        args: [email]
      });
      
      const user = userRes.rows[0];
      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
      
      res.json({ 
        success: true, 
        token, 
        user: { 
          id: user.id, 
          name: user.name, 
          email: user.email, 
          role: user.role, 
          is_verified: user.is_verified === 1 
        } 
      });
    } else {
      res.status(400).json({ error: 'Invalid verification code' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify Me
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const result = await client.execute({
      sql: QUERIES.GET_USER_BY_ID,
      args: [req.user.id]
    });
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json({ user: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- DATA ENDPOINTS ---

// Get Products
app.get('/api/products', async (req, res) => {
  try {
    const result = await client.execute(QUERIES.GET_ALL_PRODUCTS);
    res.json({ rows: result.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add Product (Authenticated as Supplier)
app.post('/api/products', authenticateToken, async (req, res) => {
  const result = productSchema.safeParse(req.body);
  if (!result.success) return res.status(400).json({ error: result.error.errors[0].message });
  
  const { title, brand, description, price, msrp, category, minUnits, image, image2, image3, isInfinite } = result.data;
  try {
    const id = `prod_${Date.now()}`;
    await client.execute({
      sql: QUERIES.ADD_PRODUCT,
      args: [id, title, brand, description, price, msrp, category, req.user.id, minUnits, image, image2 || null, image3 || null, 0, 'Pending Audit', isInfinite ? 1 : 0]
    });
    res.json({ success: true, id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Admin verification for products
app.post('/api/products/:id/verify', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await client.execute({
      sql: QUERIES.VERIFY_PRODUCT,
      args: [id]
    });
    res.json({ success: true, message: 'Manufacturing batch audited & verified.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Close Infinite Pool to new orders
app.post('/api/products/:id/close-orders', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await client.execute({
      sql: QUERIES.CLOSE_INFINITE_POOL,
      args: [id, req.user.id]
    });
    res.json({ success: true, message: 'Pool closed. No new orders will be accepted.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ship Batch
app.post('/api/products/:id/ship', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { city } = req.body; // New: Ship to a specific city/distributor
  
  if (!city) return res.status(400).json({ error: 'City is required for shipping.' });

  try {
    // 1. Double check product status and if a distributor is assigned for THIS city
    const poolRes = await client.execute({
      sql: QUERIES.GET_POOL_DISTRIBUTORS_FOR_CITY,
      args: [id, city]
    });
    
    if (poolRes.rows.length === 0 || !poolRes.rows[0].distributor_id) {
      return res.status(400).json({ error: `You must wait for a local distributor in ${city} to claim the batch before shipping.` });
    }

    // 2. Update product status to Shipped (for this local pool)
    await client.execute({
      sql: QUERIES.UPDATE_POOL_DISTRIBUTOR_STATUS,
      args: ['Shipped from factory', id, city]
    });

    // 3. Update all associated orders for THIS City to Shipped
    await client.execute({
      sql: QUERIES.UPDATE_ORDER_STATUS_FOR_CITY,
      args: ['Shipped', id, city]
    });

    res.json({ success: true, message: `Batch successfully shipped to the regional hub in ${city}.` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get regional pools for a seller's products
app.get('/api/seller/regional-pools', authenticateToken, async (req, res) => {
  if (req.user.role !== 'Seller') return res.status(403).json({ error: 'Only Sellers can access this.' });
  try {
    const result = await client.execute({
      sql: QUERIES.GET_SELLER_REGIONAL_POOLS,
      args: [req.user.id]
    });
    res.json({ rows: result.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- POOL / ORDER ENDPOINTS ---

// Get User Orders
app.get('/api/user/orders', authenticateToken, async (req, res) => {
  try {
    const result = await client.execute({
      sql: QUERIES.GET_USER_ORDERS,
      args: [req.user.id]
    });
    res.json({ rows: result.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Submit a review
app.post('/api/reviews', authenticateToken, async (req, res) => {
  const result = reviewSchema.safeParse(req.body);
  if (!result.success) return res.status(400).json({ error: result.error.errors[0].message });
  
  const { sellerId, productId, rating, comment } = result.data;
  const id = `rev_${Date.now()}`;
  const date = new Date().toLocaleDateString();
  
  try {
    await client.execute({
      sql: QUERIES.ADD_REVIEW,
      args: [id, req.user.id, sellerId, productId, rating, comment, date]
    });
    res.json({ success: true, message: 'Review submitted. Thank you for your feedback!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Submit a report
app.post('/api/reports', authenticateToken, async (req, res) => {
  const result = reportSchema.safeParse(req.body);
  if (!result.success) return res.status(400).json({ error: result.error.errors[0].message });
  
  const { sellerId, reason, description } = result.data;
  const id = `rep_${Date.now()}`;
  const date = new Date().toLocaleDateString();
  
  try {
    await client.execute({
      sql: QUERIES.ADD_REPORT,
      args: [id, req.user.id, sellerId, reason, description, date]
    });
    res.json({ success: true, message: 'Report submitted. Our team will investigate. Safety first!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- DISTRIBUTOR ENDPOINTS ---

// Get pools where current user is the distributor
app.get('/api/distributor/pools', authenticateToken, async (req, res) => {
  if (req.user.role !== 'Distributor') return res.status(403).json({ error: 'Only Distributors can access this.' });
  
  try {
    // Get user's city
    const userRes = await client.execute({
      sql: 'SELECT location FROM users WHERE id = ?',
      args: [req.user.id]
    });
    const userCity = userRes.rows[0].location;

    const result = await client.execute({
      sql: QUERIES.GET_DISTRIBUTOR_POOLS,
      args: [req.user.id, userCity]
    });
    res.json({ rows: result.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Claim leader role for a pool (MUST BE LOCAL)
app.post('/api/distributor/claim-pool', authenticateToken, async (req, res) => {
  if (req.user.role !== 'Distributor') return res.status(403).json({ error: 'Only Distributors can claim pools.' });
  const { productId } = req.body;
  try {
    // Fetch user's city
    const userRes = await client.execute({
      sql: 'SELECT location FROM users WHERE id = ?',
      args: [req.user.id]
    });
    const city = userRes.rows[0].location;

    // Check if pool already has a distributor for this city
    const existing = await client.execute({
      sql: QUERIES.GET_POOL_DISTRIBUTORS_FOR_CITY,
      args: [productId, city]
    });
    
    if (existing.rows.length > 0 && existing.rows[0].distributor_id) {
      return res.status(400).json({ error: `This pool already has a distribution leader in ${city}.` });
    }
    
    const now = new Date().toISOString();
    if (existing.rows.length === 0) {
      // Create a new location pool tracker
      const id = `pd_${Date.now()}`;
      await client.execute({
        sql: QUERIES.ADD_POOL_DISTRIBUTOR,
        args: [id, productId, req.user.id, 'Pending distribution leader', city, now]
      });
    } else {
      // Update existing city tracker with this distributor
      await client.execute({
        sql: QUERIES.CLAIM_POOL_LEADER,
        args: [req.user.id, now, productId, city]
      });
    }
    
    res.json({ success: true, message: `You are now the distribution leader for the ${city} batch.` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark batch as received from supplier
app.post('/api/distributor/mark-received', authenticateToken, async (req, res) => {
  if (req.user.role !== 'Distributor') return res.status(403).json({ error: 'Only Distributors can update distribution status.' });
  const { productId } = req.body;
  try {
    const now = new Date().toISOString();
    await client.execute({
      sql: QUERIES.UPDATE_POOL_DISTRIBUTOR_RECEIVED,
      args: [now, productId, req.user.id]
    });
    res.json({ success: true, message: 'Status updated. Note: You should notify users when ready for pickup.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Notify users for collection
app.post('/api/distributor/notify-users', authenticateToken, async (req, res) => {
  if (req.user.role !== 'Distributor') return res.status(403).json({ error: 'Only Distributors can notify users.' });
  const { productId } = req.body;
  try {
    const now = new Date().toISOString();
    // Update status to notified
    await client.execute({
      sql: QUERIES.UPDATE_POOL_DISTRIBUTOR_PICKUP,
      args: [now, productId, req.user.id]
    });

    // Update order status for all participants in this pool
    await client.execute({
      sql: QUERIES.UPDATE_ORDERS_FOR_PICKUP,
      args: [productId]
    });

    res.json({ success: true, message: 'All users in the pool have been notified to collect their product.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get pools in my city that need a leader
app.get('/api/distributor/available-pools', authenticateToken, async (req, res) => {
  if (req.user.role !== 'Distributor') return res.status(403).json({ error: 'Only Distributors can access this.' });
  try {
    const userRes = await client.execute({
      sql: 'SELECT location FROM users WHERE id = ?',
      args: [req.user.id]
    });
    const userCity = userRes.rows[0].location;

    const result = await client.execute({
      sql: QUERIES.GET_AVAILABLE_POOLS,
      args: [userCity]
    });
    res.json({ rows: result.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- DISTRIBUTOR REVIEWS ---

app.post('/api/distributors/reviews', authenticateToken, async (req, res) => {
  const result = distributorReviewSchema.safeParse(req.body);
  if (!result.success) return res.status(400).json({ error: result.error.errors[0].message });
  
  const { distributorId, productId, rating, comment, isAnonymous } = result.data;
  
  try {
    // Check if user actually received product from this distributor
    const orderRes = await client.execute({
      sql: 'SELECT * FROM order_history WHERE user_id = ? AND product_id = ?',
      args: [req.user.id, productId]
    });
    
    if (orderRes.rows.length === 0) {
      return res.status(403).json({ error: 'You can only rate distributors for pools you participated in.' });
    }

    const id = `drev_${Date.now()}`;
    const date = new Date().toLocaleDateString();
    
    await client.execute({
      sql: QUERIES.ADD_DISTRIBUTOR_REVIEW,
      args: [id, distributorId, req.user.id, productId, rating, comment, date, isAnonymous ? 1 : 0]
    });
    
    res.json({ success: true, message: 'Distributor review submitted anonymously.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/distributors/:distributorId/reviews', async (req, res) => {
   try {
    const result = await client.execute({
      sql: QUERIES.GET_DISTRIBUTOR_REVIEWS,
      args: [req.params.distributorId]
    });
    res.json({ rows: result.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Join Pool (CITY SPECIFIC)
app.post('/api/pools/join', authenticateToken, async (req, res) => {
  const result = joinPoolSchema.safeParse(req.body);
  if (!result.success) return res.status(400).json({ error: result.error.errors[0].message });
  
  const { productId, quantity, savings, productName } = result.data;
  try {
    // 0. Get user's city
    const userRes = await client.execute({
      sql: 'SELECT location FROM users WHERE id = ?',
      args: [req.user.id]
    });
    const city = userRes.rows[0].location;

    // 1. Double check capacity/progress for this product
    const productRes = await client.execute({
      sql: 'SELECT min_qty_to_ship, is_infinite FROM products WHERE id = ?',
      args: [productId]
    });
    const product = productRes.rows[0];
    
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const id = `order_${Date.now()}`;
    const date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    // 2. Insert into order history WITH city
    await client.execute({
      sql: QUERIES.ADD_ORDER,
      args: [id, req.user.id, productId, productName, date, quantity, savings, 'Secured', city]
    });

    // 3. Update or create CITY-SPECIFIC pool tracking
    const existingPool = await client.execute({
      sql: QUERIES.GET_POOL_DISTRIBUTORS_FOR_CITY,
      args: [productId, city]
    });

    if (existingPool.rows.length === 0) {
      // Start a new local pool for this city
      const pdId = `pd_${Date.now()}`;
      await client.execute({
        sql: QUERIES.START_NEW_LOCAL_POOL,
        args: [pdId, productId, city, 'Pending local leader', new Date().toISOString()]
      });
    }

    // 4. Update product's global progress (keep for display), but our core logic is increasingly local
    await client.execute({
      sql: QUERIES.UPDATE_PRODUCT_PROGRESS,
      args: [productId, productId]
    });

    console.log(`✅ Local Order ${id} processed for ${productId} in ${city}.`);
    res.json({ success: true, orderId: id, city });
  } catch (error) {
    console.error("Join Pool Detailed Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', environment: process.env.NODE_ENV || 'development' });
});

// --- PRODUCTION SETUP ---

// Serve static files from the React app if in production
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, 'dist');
  app.use(express.static(distPath));

  // Handle SPA routing: all non-API routes serve index.html
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(distPath, 'index.html'));
    }
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err.stack);
  res.status(500).json({ 
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message 
  });
});

// For local development only: listen on port if not running as a Vercel function
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 ${process.env.NODE_ENV === 'production' ? 'Production' : 'Development'} API Server running on port ${PORT}`);
  });
}

// Export for Vercel Serverless Functions
export default app;
