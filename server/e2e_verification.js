const http = require('http');

async function testE2E() {
  const baseUrl = 'http://localhost:3000';
  console.log('Testing against ' + baseUrl);

  // 1. Register
  const testEmail = `journey_${Date.now()}@example.com`;
  const regRes = await fetch(`${baseUrl}/api/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Emma Watson',
      email: testEmail,
      phone: '1234567890',
      password: 'initialPass123'
    })
  });
  const regData = await regRes.json();
  console.log('1. Register response:', regRes.status, regData.success);
  if (!regData.success) throw new Error('Registration failed');

  // 2. Forgot Password
  const forgotRes = await fetch(`${baseUrl}/api/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail })
  });
  const forgotData = await forgotRes.json();
  console.log('2. Forgot password response:', forgotRes.status, 'token:', forgotData.resetToken);
  if (!forgotData.resetToken) throw new Error('No resetToken returned');

  // 3. Reset Password
  const resetRes = await fetch(`${baseUrl}/api/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testEmail,
      token: forgotData.resetToken,
      newPassword: 'updatedPass456'
    })
  });
  const resetData = await resetRes.json();
  console.log('3. Reset password response:', resetRes.status, resetData.message);
  if (!resetData.success) throw new Error('Reset password failed');

  // 4. Login with new password
  const loginRes = await fetch(`${baseUrl}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testEmail,
      password: 'updatedPass456'
    })
  });
  const loginData = await loginRes.json();
  console.log('4. Login response:', loginRes.status, loginData.user ? loginData.user.name : 'no user');
  if (!loginData.success) throw new Error('Login failed with new password');

  // 5. Update profile and addresses
  const profRes = await fetch(`${baseUrl}/api/user/profile`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testEmail,
      name: 'Emma Watson-Brown',
      phone: '9876543210',
      addresses: [{
        label: 'Home',
        recipient: 'Emma Watson',
        street: '45 Rose Garden Way',
        city: 'Palo Alto',
        state: 'CA',
        zip: '94301',
        phone: '9876543210'
      }]
    })
  });
  const profData = await profRes.json();
  console.log('5. Update profile response:', profRes.status, profData.user ? profData.user.addresses.length : 0);

  // 6. Place an order
  const checkoutRes = await fetch(`${baseUrl}/api/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: [
        { id: 'prod-1', name: 'Blossoms in Pink', price: 1099, qty: 1, image: 'images/featured1.png' }
      ],
      subtotal: 1099,
      discount: 100,
      shipping: 50,
      total: 1049,
      customer: {
        name: 'Emma Watson-Brown',
        email: testEmail,
        phone: '9876543210'
      },
      shippingAddress: {
        recipient: 'Emma Watson',
        street: '45 Rose Garden Way',
        city: 'Palo Alto',
        state: 'CA',
        zip: '94301'
      },
      deliveryDate: '2026-09-20',
      deliveryTimeSlot: 'Midnight Surprise Delivery (11:30 PM - 12:00 AM)',
      occasion: 'Birthday',
      giftMessage: 'Wishing you a joyful year ahead!',
      paymentMethod: 'cod'
    })
  });
  const checkoutData = await checkoutRes.json();
  console.log('6. Checkout response:', checkoutRes.status, 'orderNumber:', checkoutData.orderNumber);
  if (!checkoutData.success) throw new Error('Checkout failed');

  // 7. Retrieve user orders
  const ordersRes = await fetch(`${baseUrl}/api/user/orders?email=${encodeURIComponent(testEmail)}`);
  const ordersData = await ordersRes.json();
  console.log('7. User orders count:', ordersData.orders ? ordersData.orders.length : 0);
  if (!ordersData.orders || ordersData.orders.length === 0) throw new Error('Orders not retrieved');
  console.log('   Retrieved order number:', ordersData.orders[0].orderNumber);

  // 8. Submit product review
  const reviewRes = await fetch(`${baseUrl}/api/products/prod-1/review`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userName: 'Emma W.',
      rating: 5,
      comment: 'Absolutely enchanting blooms! Stayed fresh for over a week.'
    })
  });
  const reviewData = await reviewRes.json();
  console.log('8. Review response:', reviewRes.status, reviewData.success, 'new rating:', reviewData.product ? reviewData.product.rating : 'n/a');

  console.log('\n=== ALL END-TO-END VERIFICATION CHECKS PASSED SUCCESSFULLY! ===');
}

testE2E().catch(err => {
  console.error('E2E Verification Error:', err);
  process.exit(1);
});
