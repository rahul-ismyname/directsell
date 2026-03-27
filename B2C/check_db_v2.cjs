const { createClient } = require("@libsql/client");
require('dotenv').config();

const client = createClient({
  url: process.env.VITE_TURSO_URL,
  authToken: process.env.VITE_TURSO_TOKEN,
});

async function checkSchema() {
  try {
    const list = await client.execute("SELECT name FROM sqlite_master WHERE type='table'");
    console.log("Tables found:", list.rows.map(r => r.name).join(', '));
    
    for (const table of list.rows) {
      const res = await client.execute(`SELECT sql FROM sqlite_master WHERE name = '${table.name}'`);
      console.log(`\nTable: ${table.name}`);
      console.log(res.rows[0].sql);
    }
  } catch (err) {
    console.error("DB error:", err);
  } finally {
    process.exit(0);
  }
}

checkSchema();
