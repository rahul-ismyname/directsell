const { createClient } = require("@libsql/client");
const fs = require('fs');
require('dotenv').config();

const client = createClient({
  url: process.env.VITE_TURSO_URL,
  authToken: process.env.VITE_TURSO_TOKEN,
});

async function check() {
  let output = "";
  try {
    const orders = await client.execute("SELECT * FROM order_history");
    output += "--- Order History ---\n" + JSON.stringify(orders.rows, null, 2) + "\n\n";
    
    const products = await client.execute("SELECT id, title, min_qty_to_ship, progress FROM products");
    output += "--- Products ---\n" + JSON.stringify(products.rows, null, 2) + "\n";
    
    fs.writeFileSync('diagnostic_output.txt', output);
    console.log("Diagnostic output written to diagnostic_output.txt");
  } catch (err) {
    console.error("Diagnostic error:", err);
  } finally {
    process.exit(0);
  }
}

check();
