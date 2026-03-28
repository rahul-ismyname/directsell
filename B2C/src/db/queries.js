/**
 * Update your SQL queries here. 
 * This file serves as the single source of truth for your Turso database queries.
 * No need to change SQL in Turso console/panel once you manage it from here.
 */

export const QUERIES = {
  // Auth & Users
  GET_USER_BY_EMAIL: `SELECT * FROM users WHERE email = ?`,
  GET_USER_SAFE: `SELECT id, name, email, role, is_verified FROM users WHERE email = ?`,
  GET_USER_BY_ID: `SELECT id, name, email, role, is_verified FROM users WHERE id = ?`,
  GET_USER_CITY: `SELECT location FROM users WHERE id = ?`,
  REGISTER_USER: `INSERT INTO users (id, name, email, password, role, is_verified, verification_code, location) VALUES (?, ?, ?, ?, ?, 0, ?, ?)`,
  VERIFY_USER_UPDATE: `UPDATE users SET is_verified = 1 WHERE email = ? AND verification_code = ?`,
  UPDATE_USER_KYC: `UPDATE users SET kyc_status = 'Verified', shop_name = ?, owner_name = ?, business_category = ?, gstin = ?, upi_id = ? WHERE id = ?`,

  // Products
  GET_ALL_PRODUCTS: `SELECT * FROM products`,
  GET_PRODUCT_BY_ID: `SELECT * FROM products WHERE id = ?`,
  ADD_PRODUCT: `INSERT INTO products (id, title, brand, description, price, msrp, category, supplier_id, min_qty_to_ship, image, image2, image3, progress, status, is_infinite) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  VERIFY_PRODUCT: `UPDATE products SET status = 'Verified' WHERE id = ?`,
  CLOSE_INFINITE_POOL: `UPDATE products SET is_infinite = 0 WHERE id = ? AND supplier_id = ?`,
  UPDATE_PRODUCT_PROGRESS: `UPDATE products SET progress = (SELECT CASE WHEN p.is_infinite = 1 THEN (SUM(oh.units) * 100 / p.min_qty_to_ship) ELSE MIN(100, (SUM(units) * 100 / p.min_qty_to_ship)) END FROM order_history oh JOIN products p ON oh.product_id = p.id WHERE p.id = ?) WHERE id = ?`,

  // Pools & Localized Logistics
  GET_SELLER_REGIONAL_POOLS: `SELECT pd.*, p.title FROM pool_distributors pd JOIN products p ON pd.product_id = p.id WHERE p.supplier_id = ?`,
  GET_POOL_DISTRIBUTORS_FOR_CITY: `SELECT * FROM pool_distributors WHERE product_id = ? AND city = ?`,
  UPDATE_POOL_DISTRIBUTOR_STATUS: `UPDATE pool_distributors SET status = ? WHERE product_id = ? AND city = ?`,
  UPDATE_POOL_DISTRIBUTOR_STATUS_WITH_TIME: `UPDATE pool_distributors SET status = ?, last_updated = ? WHERE product_id = ? AND city = ?`,
  ADD_POOL_DISTRIBUTOR: `INSERT INTO pool_distributors (id, product_id, distributor_id, status, city, last_updated) VALUES (?, ?, ?, ?, ?, ?)`,
  START_NEW_LOCAL_POOL: `INSERT INTO pool_distributors (id, product_id, city, status, last_updated) VALUES (?, ?, ?, ?, ?)`,
  CLAIM_POOL_LEADER: `UPDATE pool_distributors SET distributor_id = ?, last_updated = ? WHERE product_id = ? AND city = ?`,

  // Orders
  GET_USER_ORDERS: `SELECT oh.*, p.supplier_id, pd.distributor_id, du.name as distributor_name FROM order_history oh LEFT JOIN products p ON oh.product_id = p.id LEFT JOIN pool_distributors pd ON p.id = pd.product_id LEFT JOIN users du ON pd.distributor_id = du.id WHERE oh.user_id = ? ORDER BY oh.date DESC`,
  ADD_ORDER: `INSERT INTO order_history (id, user_id, product_id, name, date, units, savings, status, city) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  UPDATE_ORDER_STATUS_FOR_CITY: `UPDATE order_history SET status = ? WHERE product_id = ? AND city = ?`,
  UPDATE_ORDERS_FOR_PICKUP: `UPDATE order_history SET status = 'Ready for Pickup' WHERE product_id = ?`,

  // Distributor Support
  GET_DISTRIBUTOR_POOLS: `SELECT pd.*, p.title, p.brand, p.image, p.status as product_status FROM pool_distributors pd JOIN products p ON pd.product_id = p.id WHERE pd.distributor_id = ? AND pd.city = ?`,
  GET_AVAILABLE_POOLS: `SELECT pd.*, p.title, p.brand, p.image, p.price, p.min_qty_to_ship FROM pool_distributors pd JOIN products p ON pd.product_id = p.id WHERE pd.city = ? AND (pd.distributor_id IS NULL OR pd.distributor_id = '')`,

  // Reviews & Reports
  ADD_REVIEW: `INSERT INTO reviews (id, user_id, seller_id, product_id, rating, comment, date) VALUES (?, ?, ?, ?, ?, ?, ?)`,
  ADD_REPORT: `INSERT INTO reports (id, user_id, seller_id, reason, description, date) VALUES (?, ?, ?, ?, ?, ?)`,
  ADD_DISTRIBUTOR_REVIEW: `INSERT INTO distributor_reviews (id, distributor_id, user_id, product_id, rating, comment, date, is_anonymous) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  GET_DISTRIBUTOR_REVIEWS: `SELECT dr.rating, dr.comment, dr.date, CASE WHEN dr.is_anonymous = 1 THEN 'Anonymous' ELSE u.name END as reviewer_name FROM distributor_reviews dr LEFT JOIN users u ON dr.user_id = u.id WHERE dr.distributor_id = ?`,

  // Pool Engine: Deals & Shares
  CREATE_DEAL: `INSERT INTO deals (id, product_id, supplier_id, total_units, price_per_unit, status, end_date, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  GET_ALL_DEALS: `SELECT d.*, p.title, p.image FROM deals d JOIN products p ON d.product_id = p.id WHERE d.status = 'Open'`,
  GET_DEAL_BY_ID: `SELECT d.*, p.title, p.brand, p.description, p.image FROM deals d JOIN products p ON d.product_id = p.id WHERE d.id = ?`,
  PURCHASE_SHARE: `INSERT INTO pool_shares (id, deal_id, user_id, units, pledged_amount, payment_status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
  UPDATE_DEAL_PROGRESS: `UPDATE deals SET units_pledged = (SELECT SUM(units) FROM pool_shares WHERE deal_id = ?) WHERE id = ?`,
  GET_USER_SHARES: `SELECT ps.*, d.price_per_unit, p.title as product_title FROM pool_shares ps JOIN deals d ON ps.deal_id = d.id JOIN products p ON d.product_id = p.id WHERE ps.user_id = ?`
};
