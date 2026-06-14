const { Client } = require('pg');

const regions = [
  'aws-0-ap-southeast-1.pooler.supabase.com',
  'aws-0-us-east-1.pooler.supabase.com',
  'aws-0-eu-central-1.pooler.supabase.com',
  'aws-0-us-west-1.pooler.supabase.com',
];

async function test(host) {
  const client = new Client({
    host,
    port: 6543,
    database: 'postgres',
    user: 'postgres.svkitfafeceogtzklkzs',
    password: 'Phapvan$123',
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 5000,
  });

  try {
    await client.connect();
    const r = await client.query('SELECT current_database()');
    console.log(`✅ CONNECTED via ${host}:`, r.rows[0]);
    await client.end();
    return true;
  } catch (e) {
    console.log(`❌ ${host}: ${e.message}`);
    return false;
  }
}

(async () => {
  for (const r of regions) {
    const ok = await test(r);
    if (ok) break;
  }
})();
