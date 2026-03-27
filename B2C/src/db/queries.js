/**
 * Update your SQL queries here. 
 * This file serves as the single source of truth for your Turso database queries.
 * No need to change SQL in Turso console/panel once you manage it from here.
 */

export const QUERIES = {
  // Products & Pools
  GET_ALL_PRODUCTS: `SELECT * FROM products`,
  GET_PRODUCT_BY_ID: `SELECT * FROM products WHERE id = ?`,
  
  // User Actions
  GET_ACTIVE_POOLS: `SELECT * FROM active_pools`,
  GET_ORDER_HISTORY: `SELECT * FROM order_history`,
  GET_PRODUCTS_BY_SUPPLIER: `SELECT * FROM products WHERE supplier_id = ?`,
  ADD_PRODUCT: `INSERT INTO products (id, title, brand, description, price, msrp, category, supplier_id, min_qty_to_ship, image, progress, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  VERIFY_PRODUCT: `UPDATE products SET status = 'Verified' WHERE id = ?`,
  
  // Analytics
  GET_TOTAL_SAVINGS: `SELECT SUM(savings) as total FROM order_history`,
  
  // Seller
  GET_SELLER_STATS: `SELECT * FROM seller_stats`,

  // Auth
  GET_USER_BY_EMAIL: `SELECT * FROM users WHERE email = ?`,
  REGISTER_USER: `INSERT INTO users (id, name, email, password, role, is_verified, verification_code) VALUES (?, ?, ?, ?, ?, 0, ?)`,
  UPDATE_VERIFICATION_CODE: `UPDATE users SET verification_code = ? WHERE email = ?`,
  VERIFY_USER: `UPDATE users SET is_verified = 1 WHERE email = ? AND verification_code = ?`
};
