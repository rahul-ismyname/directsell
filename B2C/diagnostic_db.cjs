const { createClient } = require("@libsql/client");
require('dotenv').config();

const client = createClient({
  url: process.env.VITE_TURSO_URL,
  authToken: process.env.VITE_TURSO_TOKEN,
});

async function check() {
  try {
    const orders = await client.execute("SELECT * FROM order_history");
    console.log("--- Orders ---");
    console.table(orders.rows);
    
    const products = await client.execute("SELECT id, title, min_qty_to_ship, progress FROM products");
    console.log("\n--- Products ---");
    console.table(products.rows);
  } catch (err) {
    console.error("Diagnostic error:", err);
  } finally {
    process.exit(0);
  }
}

check();
