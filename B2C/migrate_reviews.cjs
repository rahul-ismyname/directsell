const { createClient } = require("@libsql/client");
require('dotenv').config();

const client = createClient({
  url: process.env.VITE_TURSO_URL,
  authToken: process.env.VITE_TURSO_TOKEN,
});

async function migrate() {
  try {
    console.log("Creating reviews and reports tables...");
    await client.execute(`
      CREATE TABLE IF NOT EXISTS reviews (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        seller_id TEXT,
        product_id TEXT,
        rating INTEGER,
        comment TEXT,
        date TEXT
      )
    `);
    await client.execute(`
      CREATE TABLE IF NOT EXISTS reports (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        seller_id TEXT,
        reason TEXT,
        description TEXT,
        date TEXT,
        status TEXT DEFAULT 'Open'
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
