const { createClient } = require("@libsql/client");
require('dotenv').config();

const client = createClient({
  url: process.env.VITE_TURSO_URL,
  authToken: process.env.VITE_TURSO_TOKEN,
});

async function migrate() {
  try {
    console.log("Migrating order_history table...");
    await client.execute("ALTER TABLE order_history ADD COLUMN user_id TEXT REFERENCES users(id)");
    await client.execute("ALTER TABLE order_history ADD COLUMN product_id TEXT REFERENCES products(id)");
    console.log("Migration successful!");
  } catch (err) {
    console.error("Migration failed (might already have columns):", err.message);
  } finally {
    process.exit(0);
  }
}

migrate();
