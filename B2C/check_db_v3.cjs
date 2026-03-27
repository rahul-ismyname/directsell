const { createClient } = require("@libsql/client");
const fs = require('fs');
require('dotenv').config();

const client = createClient({
  url: process.env.VITE_TURSO_URL,
  authToken: process.env.VITE_TURSO_TOKEN,
});

async function checkSchema() {
  let output = "";
  try {
    const list = await client.execute("SELECT name FROM sqlite_master WHERE type='table'");
    output += `Tables found: ${list.rows.map(r => r.name).join(', ')}\n`;
    
    for (const table of list.rows) {
      const res = await client.execute(`SELECT sql FROM sqlite_master WHERE name = '${table.name}'`);
      output += `\n--- Table: ${table.name} ---\n${res.rows[0].sql}\n`;
    }
    fs.writeFileSync('db_schema_output.txt', output);
    console.log("Schema written to db_schema_output.txt");
  } catch (err) {
    console.error("DB error:", err);
  } finally {
    process.exit(0);
  }
}

checkSchema();
