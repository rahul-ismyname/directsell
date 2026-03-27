const { createClient } = require("@libsql/client");
require('dotenv').config();

const client = createClient({
  url: process.env.VITE_TURSO_URL,
  authToken: process.env.VITE_TURSO_TOKEN,
});

async function migrate() {
  try {
    console.log("Creating distributor tables...");
    await client.execute(`
      CREATE TABLE IF NOT EXISTS pool_distributors (
        id TEXT PRIMARY KEY,
        product_id TEXT REFERENCES products(id),
        distributor_id TEXT REFERENCES users(id),
        status TEXT DEFAULT 'Pending distribution leader', 
        last_updated TEXT
      )
    `);
    await client.execute(`
      CREATE TABLE IF NOT EXISTS distributor_reviews (
        id TEXT PRIMARY KEY,
        distributor_id TEXT REFERENCES users(id),
        user_id TEXT REFERENCES users(id),
        product_id TEXT REFERENCES products(id),
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        date TEXT,
        is_anonymous INTEGER DEFAULT 1
      )
    `);
    console.log("Migration successful!");
  } catch (err) {
    console.error("Migration failed:", err.message);
  } finally {
    process.exit(0);
  }
}

migrate();
