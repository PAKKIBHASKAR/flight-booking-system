const db = require('./db');

async function showAllTablesAndContent() {
  try {
    console.log('\n==================================================');
    console.log('📦  ALL DATABASE TABLES PRESENT IN FLIGHTS.DB');
    console.log('==================================================\n');

    // 1. Get list of all table names in SQLite master catalog
    const tables = await db.query("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'");
    console.log('List of Tables Found:');
    tables.forEach((t, idx) => {
      console.log(`  ${idx + 1}. ${t.name}`);
    });
    console.log('\n');

    // 2. Loop through each table and print table contents
    for (const table of tables) {
      const tableName = table.name;
      console.log(`--------------------------------------------------`);
      console.log(`📋 TABLE NAME: "${tableName.toUpperCase()}"`);
      console.log(`--------------------------------------------------`);
      
      const rows = await db.query(`SELECT * FROM ${tableName}`);
      if (rows.length === 0) {
        console.log(`(Table "${tableName}" is currently empty)\n`);
      } else {
        console.table(rows);
        console.log(`Total Rows: ${rows.length}\n`);
      }
    }

    process.exit(0);
  } catch (err) {
    console.error('Error querying database:', err);
    process.exit(1);
  }
}

showAllTablesAndContent();
