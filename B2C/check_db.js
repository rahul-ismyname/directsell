import { createClient } from "@libsql/client";
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const client = createClient({
  url: process.env.VITE_TURSO_URL,
  authToken: process.env.VITE_TURSO_TOKEN,
});

async function checkSchema() {
  try {
    const result = await client.execute("SELECT sql FROM sqlite_master WHERE name = 'order_history'");
    if (result.rows.length > 0) {
      console.log("Schema for order_history:");
      console.log(result.rows[0].sql);
    } else {
      console.log("Table order_history NOT FOUND");
    }
    
    const prodResult = await client.execute("SELECT sql FROM sqlite_master WHERE name = 'products'");
    if (prodResult.rows.length > 0) {
      console.log("\nSchema for products:");
      console.log(prodResult.rows[0].sql);
    } else {
      console.log("Table products NOT FOUND");
    }
  } catch (error) {
    console.error("Error checking schema:", error);
  } finally {
    process.exit(0);
  }
}

checkSchema();
