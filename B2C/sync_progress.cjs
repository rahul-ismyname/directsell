const { createClient } = require("@libsql/client");
require('dotenv').config();

const client = createClient({
  url: process.env.VITE_TURSO_URL,
  authToken: process.env.VITE_TURSO_TOKEN,
});

async function repair() {
  try {
    console.log("Recalculating all product progress heights...");
    const products = await client.execute("SELECT id FROM products");
    
    for (const row of products.rows) {
      const pid = row.id;
      await client.execute({
        sql: `UPDATE products 
              SET progress = (
                SELECT MIN(100, (IFNULL(SUM(units), 0) * 100 / (SELECT min_qty_to_ship FROM products WHERE id = ?)))
                FROM order_history WHERE product_id = ?
              )
              WHERE id = ?`,
        args: [pid, pid, pid]
      });
      console.log(`Updated product ${pid}`);
    }
    console.log("Database sync complete!");
  } catch (err) {
    console.error("Repair failed:", err.message);
  } finally {
    process.exit(0);
  }
}

repair();
