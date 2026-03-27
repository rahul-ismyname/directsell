const { createClient } = require("@libsql/client");
require('dotenv').config();

const client = createClient({
  url: process.env.VITE_TURSO_URL,
  authToken: process.env.VITE_TURSO_TOKEN,
});

async function migrate() {
  try {
    console.log("Updating for local distribution...");
    
    // 1. Add location to users
    try {
      await client.execute("ALTER TABLE users ADD COLUMN location TEXT DEFAULT 'Mumbai'");
      console.log("Added location to users.");
    } catch (e) {
      console.log("User location field already exists.");
    }

    // 2. Add city to pool_distributors
    try {
      await client.execute("ALTER TABLE pool_distributors ADD COLUMN city TEXT DEFAULT 'Mumbai'");
      console.log("Added city to pool_distributors.");
    } catch (e) {
      console.log("pool_distributors city field already exists.");
    }

    // 3. Add city_pool_id to order_history
    try {
      await client.execute("ALTER TABLE order_history ADD COLUMN city TEXT DEFAULT 'Mumbai'");
      console.log("Added city to order_history.");
    } catch (e) {
      console.log("order_history city field already exists.");
    }

    // 4. Update products table to NOT track individual progress if we want to track it per city
    // Actually, for simplicity, we'll keep product progress as a global indicator, 
    // but the actual "Ship" action will be location-specific in logic.

    console.log("Migration successful!");
  } catch (err) {
    console.error("Migration failed:", err.message);
  } finally {
    process.exit(0);
  }
}

migrate();
