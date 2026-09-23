// Simple smoke-test script for the Flower-shop backend.
// Usage: ensure the server is running (npm start), then run `node test_requests.js` from the `server` folder.

const fs = require('fs').promises;
const base = 'http://localhost:3000';

async function post(path, body) {
  const url = base + path;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const text = await res.text();
    let json;
    try { json = JSON.parse(text); } catch(e) { json = text; }
    return { ok: res.ok, status: res.status, body: json };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

async function readData(file) {
  try {
    const txt = await fs.readFile(file, 'utf8');
    return txt;
  } catch (err) {
    return 'ERROR: ' + String(err);
  }
}

(async () => {
  console.log('Running smoke tests against', base);

  console.log('\n1) POST /api/register');
  const r1 = await post('/api/register', { name: 'Smoke Tester', email: 'smoke+reg@example.com', password: 'pw' });
  console.log('Result:', r1);

  console.log('\n2) POST /api/contact');
  const r2 = await post('/api/contact', { name: 'Smoke Tester', email: 'smoke+contact@example.com', message: 'Hello from smoke test' });
  console.log('Result:', r2);

  console.log('\n3) Reading data files:');
  console.log('registrations.json:\n', await readData('./data/registrations.json'));
  console.log('contacts.json:\n', await readData('./data/contacts.json'));
  console.log('orders.json:\n', await readData('./data/orders.json'));

  console.log('\nSmoke test finished.');
})();
