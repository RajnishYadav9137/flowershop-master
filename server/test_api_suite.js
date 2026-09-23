// Comprehensive Automated Test Suite for Happy Petals API
const http = require('http');

async function request(url, options = {}) {
  const res = await fetch(url, options);
  let data;
  try {
    data = await res.json();
  } catch (e) {
    data = await res.text();
  }
  return { status: res.status, ok: res.ok, data };
}

async function runTests() {
  console.log('=== Starting Happy Petals Backend API Automated Test Suite ===\n');

  // Spawn server as child process
  const { fork } = require('child_process');
  const path = require('path');
  const serverPath = path.join(__dirname, 'server.js');

  const testPort = 3009;
  const env = { ...process.env, PORT: testPort };
  const serverProcess = fork(serverPath, [], { env, silent: true });

  let serverOutput = '';
  serverProcess.stdout.on('data', (d) => { serverOutput += d.toString(); });
  serverProcess.stderr.on('data', (d) => { serverOutput += d.toString(); });

  // Wait for server to become available
  const baseUrl = `http://localhost:${testPort}`;
  let up = false;
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 400));
    try {
      const ping = await request(`${baseUrl}/health`);
      if (ping.ok && ping.data.status === 'ok') {
        up = true;
        break;
      }
    } catch (e) {}
  }

  if (!up) {
    console.error('Server failed to start in time. Output:\n', serverOutput);
    serverProcess.kill();
    process.exit(1);
  }

  console.log(`Server successfully started on ${baseUrl}`);
  let passed = 0;
  let failed = 0;

  function assert(condition, name, details) {
    if (condition) {
      console.log(`  [PASS] ${name}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${name}`, details || '');
      failed++;
    }
  }

  try {
    // 1. GET /api/products
    console.log('\n1. Testing Products Catalog API...');
    const productsRes = await request(`${baseUrl}/api/products`);
    assert(productsRes.ok && productsRes.data.products && productsRes.data.products.length > 0, 'GET /api/products returns items list');
    const roseFilter = await request(`${baseUrl}/api/products?category=roses`);
    assert(roseFilter.ok && roseFilter.data.products.every(p => p.category === 'roses'), 'GET /api/products?category=roses filters properly');
    const searchFilter = await request(`${baseUrl}/api/products?search=spring`);
    assert(searchFilter.ok && searchFilter.data.products.some(p => p.name.toLowerCase().includes('spring')), 'GET /api/products?search=spring finds matching flowers');

    // 2. POST /api/register
    console.log('\n2. Testing User Registration...');
    const testEmail = `testuser_${Date.now()}@example.com`;
    const regRes = await request(`${baseUrl}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Lily Bloom',
        email: testEmail,
        phone: '+1 408 555 1234',
        password: 'secretPassword123'
      })
    });
    assert(regRes.ok && regRes.data.success && regRes.data.user && regRes.data.user.email === testEmail, 'POST /api/register creates user and returns user object', regRes.data);

    // Test duplicate registration error
    const dupRes = await request(`${baseUrl}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Lily Duplicate',
        email: testEmail,
        password: 'secretPassword123'
      })
    });
    assert(dupRes.status === 409, 'POST /api/register rejects duplicate email with 409 status');

    // 3. POST /api/login
    console.log('\n3. Testing User Login...');
    const loginRes = await request(`${baseUrl}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'secretPassword123'
      })
    });
    assert(loginRes.ok && loginRes.data.success && loginRes.data.user.name === 'Lily Bloom', 'POST /api/login validates credentials and returns profile');

    const badLogin = await request(`${baseUrl}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'wrongPassword'
      })
    });
    assert(badLogin.status === 401, 'POST /api/login rejects invalid password with 401');

    // 3b. POST /api/forgot-password & POST /api/reset-password
    console.log('\n3b. Testing Password Reset Flow...');
    const forgotRes = await request(`${baseUrl}/api/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail })
    });
    assert(forgotRes.ok && forgotRes.data.success && forgotRes.data.resetToken, 'POST /api/forgot-password generates and returns resetToken');
    const resetToken = forgotRes.data.resetToken;

    const resetRes = await request(`${baseUrl}/api/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        token: resetToken,
        newPassword: 'brandNewPassword456'
      })
    });
    assert(resetRes.ok && resetRes.data.success, 'POST /api/reset-password updates password successfully');

    const newLoginRes = await request(`${baseUrl}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'brandNewPassword456'
      })
    });
    assert(newLoginRes.ok && newLoginRes.data.success, 'POST /api/login works with new password after reset');

    // 4. GET & PUT /api/user/profile
    console.log('\n4. Testing User Profile...');
    const profRes = await request(`${baseUrl}/api/user/profile?email=${encodeURIComponent(testEmail)}`);
    assert(profRes.ok && profRes.data.user.email === testEmail, 'GET /api/user/profile retrieves user profile');

    const updateRes = await request(`${baseUrl}/api/user/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        name: 'Lily Bloom-Smith',
        phone: '+1 408 555 9999',
        addresses: [{
          id: 'addr_1',
          name: 'Home',
          street: '123 Blossom Lane',
          city: 'San Jose',
          state: 'CA',
          zip: '95112'
        }]
      })
    });
    assert(updateRes.ok && updateRes.data.user.name === 'Lily Bloom-Smith' && updateRes.data.user.addresses.length === 1, 'PUT /api/user/profile updates name and addresses');

    // 5. POST /api/checkout
    console.log('\n5. Testing Checkout & Order Placement...');
    const orderRes = await request(`${baseUrl}/api/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [
          { id: 'prod-1', name: 'Blossoms in Pink', price: 1099, quantity: 2, image: 'images/featured1.png' }
        ],
        subtotal: 2198,
        discount: 200,
        shipping: 0,
        total: 1998,
        customer: {
          name: 'Lily Bloom-Smith',
          email: testEmail,
          phone: '+1 408 555 9999'
        },
        shippingAddress: {
          recipientName: 'Rose Bloom',
          street: '123 Blossom Lane',
          city: 'San Jose',
          state: 'CA',
          zip: '95112'
        },
        deliveryDate: '2026-09-18',
        deliveryTimeSlot: 'Morning (9 AM - 1 PM)',
        giftMessage: 'Happy Birthday Mom! Love Lily',
        paymentMethod: 'card'
      })
    });
    assert(orderRes.ok && orderRes.data.success && orderRes.data.orderNumber, 'POST /api/checkout creates order with orderNumber');

    // 6. GET /api/user/orders
    console.log('\n6. Testing Orders Retrieval...');
    const userOrders = await request(`${baseUrl}/api/user/orders?email=${encodeURIComponent(testEmail)}`);
    assert(userOrders.ok && userOrders.data.orders.length > 0 && userOrders.data.orders[0].customer.email === testEmail, 'GET /api/user/orders retrieves customer orders');

    // 7. POST /api/contact
    console.log('\n7. Testing Contact Form...');
    const contactRes = await request(`${baseUrl}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Lily Bloom-Smith',
        email: testEmail,
        message: 'Do you deliver on Sunday mornings?'
      })
    });
    assert(contactRes.ok && contactRes.data.success, 'POST /api/contact records message');

  } catch (err) {
    console.error('Unexpected error during testing:', err);
    failed++;
  } finally {
    serverProcess.kill();
    console.log(`\n=== Test Suite Complete: ${passed} Passed, ${failed} Failed ===`);
    process.exit(failed > 0 ? 1 : 0);
  }
}

runTests();
