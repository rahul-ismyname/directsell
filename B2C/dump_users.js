import dotenv from 'dotenv';
import { createClient } from "@libsql/client";

dotenv.config();

const client = createClient({
  url: process.env.VITE_TURSO_URL || '',
  authToken: process.env.VITE_TURSO_TOKEN || '',
});

async function test() {
  try {
    const result = await client.execute("SELECT id, name, email FROM users LIMIT 10");
    console.log("Users:", result.rows);
  } catch (error) {
    console.error("Error:", error);
  }
}

test();
