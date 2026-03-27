const { createClient } = require("@libsql/client");
require('dotenv').config();

const client = createClient({
  url: process.env.VITE_TURSO_URL,
  authToken: process.env.VITE_TURSO_TOKEN,
});

async function check() {
  try {
    const res = await client.execute("SELECT id, name, email, role FROM users WHERE email = 'dist@test.com'");
    console.log(JSON.stringify(res.rows, null, 2));
    
    // Also check pools
    const poolsRes = await client.execute("SELECT * FROM pool_distributors");
    console.log("Pools:", JSON.stringify(poolsRes.rows, null, 2));
    
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}
check();
