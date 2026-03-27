const { createClient } = require("@libsql/client");
require('dotenv').config();

const client = createClient({
  url: process.env.VITE_TURSO_URL,
  authToken: process.env.VITE_TURSO_TOKEN,
});

async function migrate() {
  try {
    console.log("Adding is_infinite column to products...");
    await client.execute("ALTER TABLE products ADD COLUMN is_infinite INTEGER DEFAULT 0");
    console.log("Migration successful!");
  } catch (err) {
    console.error("Migration failed:", err.message);
  } finally {
    process.exit(0);
  }
}

migrate();
