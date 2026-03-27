import dotenv from 'dotenv';
import { createClient } from "@libsql/client";

dotenv.config();

// Create client with WRONG token
const client = createClient({
  url: process.env.VITE_TURSO_URL || '',
  authToken: 'wrong-token',
});

async function test() {
  try {
    const result = await client.execute("SELECT 1");
    console.log("Success:", result.rows);
  } catch (error) {
    console.log("Error type:", typeof error);
    console.log("Error message:", error.message);
    // console.log("Error object:", JSON.stringify(error, null, 2));
  }
}

test();
