const { createClient } = require("@libsql/client");
require('dotenv').config();

const client = createClient({
  url: process.env.VITE_TURSO_URL,
  authToken: process.env.VITE_TURSO_TOKEN,
});

async function migrate() {
  try {
    console.log("Adding image2 and image3 columns to products...");
    await client.execute("ALTER TABLE products ADD COLUMN image2 TEXT");
    await client.execute("ALTER TABLE products ADD COLUMN image3 TEXT");
    console.log("Migration successful!");
  } catch (err) {
    console.error("Migration failed:", err.message);
  } finally {
    process.exit(0);
  }
}

migrate();
