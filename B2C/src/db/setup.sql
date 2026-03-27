-- Turso Database Setup Script
-- Updated: Added Review/Report tables and newest product columns

CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'Verified Collector',
  is_verified INTEGER DEFAULT 0,
  verification_code TEXT
);

CREATE TABLE products (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  brand TEXT,
  description TEXT,
  progress INTEGER DEFAULT 0,
  discount TEXT,
  price INTEGER,
  msrp INTEGER,
  timeLeft TEXT,
  image TEXT,
  image2 TEXT,
  image3 TEXT,
  category TEXT,
  supplier_id TEXT,
  min_qty_to_ship INTEGER DEFAULT 1,
  status TEXT DEFAULT 'Pending Audit',
  is_infinite INTEGER DEFAULT 0,
  FOREIGN KEY (supplier_id) REFERENCES users(id)
);

CREATE TABLE order_history (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  product_id TEXT REFERENCES products(id),
  name TEXT,
  date TEXT,
  units INTEGER,
  savings TEXT,
  status TEXT
);

CREATE TABLE reviews (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  seller_id TEXT REFERENCES users(id),
  product_id TEXT REFERENCES products(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  date TEXT
);

CREATE TABLE reports (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  seller_id TEXT REFERENCES users(id),
  reason TEXT,
  description TEXT,
  date TEXT,
  status TEXT DEFAULT 'Open'
);
