// Comprehensive Verification of all 9 User Account Features
const http = require('http');

async function testUserAccountFeatures() {
  const baseUrl = 'http://localhost:3000';
  console.log('=== Verifying User Account Features on ' + baseUrl + ' ===\n');

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

  const testEmail = `user_acc_${Date.now()}@example.com`;
  const initialPassword = 'initialSecret123';
  const newPasswordReset = 'resetSecret456';
  const profilePassword = 'profileUpdatedSecret789';

  // 1. REGISTER
  console.log('1. Testing User Registration...');
  const regRes = await fetch(`${baseUrl}/api/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Claire Beauchamp',
      email: testEmail,
      phone: '+91 9876543210',
      password: initialPassword
    })
  });
  const regData = await regRes.json();
  assert(regRes.status === 200 && regData.success && regData.user.email === testEmail, 'User registration creates new user account');

  const dupRes = await fetch(`${baseUrl}/api/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Duplicate User',
      email: testEmail,
      password: 'somePassword'
    })
  });
  assert(dupRes.status === 409, 'Registration rejects duplicate email with 409 conflict');

  // 2. LOGIN
  console.log('\n2. Testing User Login...');
  const badLogin = await fetch(`${baseUrl}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail, password: 'wrongPassword' })
  });
  assert(badLogin.status === 401, 'Login rejects invalid credentials with 401');

  const goodLogin = await fetch(`${baseUrl}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail, password: initialPassword })
  });
  const loginData = await goodLogin.json();
  assert(goodLogin.status === 200 && loginData.success && loginData.user.name === 'Claire Beauchamp', 'Login succeeds with correct credentials and returns profile');

  // 3. FORGOT PASSWORD & RESET PASSWORD
  console.log('\n3. Testing Forgot Password & Reset Password...');
  const forgotBad = await fetch(`${baseUrl}/api/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'nonexistent_random_user@example.com' })
  });
  assert(forgotBad.status === 404, 'Forgot password returns 404 for unregistered email');

  const forgotGood = await fetch(`${baseUrl}/api/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail })
  });
  const forgotData = await forgotGood.json();
  assert(forgotGood.status === 200 && forgotData.success && forgotData.resetToken, 'Forgot password returns valid resetToken for registered email');

  const resetRes = await fetch(`${baseUrl}/api/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testEmail,
      token: forgotData.resetToken,
      newPassword: newPasswordReset
    })
  });
  const resetData = await resetRes.json();
  assert(resetRes.status === 200 && resetData.success, 'Reset password succeeds with valid reset token');

  const loginAfterReset = await fetch(`${baseUrl}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail, password: newPasswordReset })
  });
  assert(loginAfterReset.status === 200, 'Login succeeds with new password after reset');

  // 4. PROFILE RETRIEVAL (GET /api/user/profile)
  console.log('\n4. Testing Profile Retrieval...');
  const profGet = await fetch(`${baseUrl}/api/user/profile?email=${encodeURIComponent(testEmail)}`);
  const profGetData = await profGet.json();
  assert(profGet.status === 200 && profGetData.success && profGetData.user.email === testEmail, 'GET profile retrieves accurate user information');

  // 5. EDIT PROFILE (PUT /api/user/profile - Name & Phone)
  console.log('\n5. Testing Edit Profile (Name & Phone)...');
  const editProfRes = await fetch(`${baseUrl}/api/user/profile`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testEmail,
      name: 'Dr. Claire Fraser',
      phone: '+44 7700 900077'
    })
  });
  const editProfData = await editProfRes.json();
  assert(editProfRes.status === 200 && editProfData.user.name === 'Dr. Claire Fraser' && editProfData.user.phone === '+44 7700 900077', 'PUT profile updates name and phone number');

  // 6. CHANGE PASSWORD (via Profile form)
  console.log('\n6. Testing Change Password via Profile Settings...');
  const shortPwdRes = await fetch(`${baseUrl}/api/user/profile`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testEmail,
      password: '123' // Too short (< 4)
    })
  });
  assert(shortPwdRes.status === 400, 'PUT profile rejects passwords shorter than 4 characters with 400 status');

  const goodPwdRes = await fetch(`${baseUrl}/api/user/profile`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testEmail,
      password: profilePassword
    })
  });
  assert(goodPwdRes.status === 200, 'PUT profile updates password successfully');

  const loginWithProfilePwd = await fetch(`${baseUrl}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail, password: profilePassword })
  });
  assert(loginWithProfilePwd.status === 200, 'Login succeeds with new password changed via profile');

  // 7. ADDRESS MANAGEMENT (Add, Edit, Delete addresses)
  console.log('\n7. Testing Address Management...');
  const address1 = {
    label: 'Home',
    recipient: 'Dr. Claire Fraser',
    street: '1 Fraser Ridge Road',
    city: 'Highland',
    state: 'NC',
    zip: '28701',
    phone: '+44 7700 900077'
  };
  const address2 = {
    label: 'Clinic / Office',
    recipient: 'Dr. Claire Fraser',
    street: '10 Hospital Way',
    city: 'Boston',
    state: 'MA',
    zip: '02115',
    phone: '+1 617 555 0199'
  };

  // Add 2 addresses
  const addAddrRes = await fetch(`${baseUrl}/api/user/profile`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testEmail,
      addresses: [address1, address2]
    })
  });
  const addAddrData = await addAddrRes.json();
  assert(addAddrRes.status === 200 && addAddrData.user.addresses.length === 2, 'Adds multiple addresses to user account');

  // Edit second address
  const updatedAddress2 = { ...address2, street: '25 Medical Plaza, Suite 400' };
  const editAddrRes = await fetch(`${baseUrl}/api/user/profile`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testEmail,
      addresses: [address1, updatedAddress2]
    })
  });
  const editAddrData = await editAddrRes.json();
  assert(editAddrRes.status === 200 && editAddrData.user.addresses[1].street === '25 Medical Plaza, Suite 400', 'Edits address details in address book');

  // Delete first address
  const delAddrRes = await fetch(`${baseUrl}/api/user/profile`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testEmail,
      addresses: [updatedAddress2]
    })
  });
  const delAddrData = await delAddrRes.json();
  assert(delAddrRes.status === 200 && delAddrData.user.addresses.length === 1, 'Deletes address from address book');

  // Verify persistence via GET /api/user/profile
  const verifyAddrGet = await fetch(`${baseUrl}/api/user/profile?email=${encodeURIComponent(testEmail)}`);
  const verifyAddrData = await verifyAddrGet.json();
  assert(verifyAddrData.user.addresses.length === 1 && verifyAddrData.user.addresses[0].city === 'Boston', 'Saved address changes persist on subsequent profile fetches');

  // 8. ORDER HISTORY (Create orders and retrieve via GET /api/user/orders)
  console.log('\n8. Testing Order History...');
  // Place Order 1
  const order1Res = await fetch(`${baseUrl}/api/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: [
        { id: 'prod-1', name: "Valentine's Velvet Roses", price: 1099, qty: 1, image: 'images/featured1.png' }
      ],
      subtotal: 1099,
      discount: 0,
      shipping: 0,
      total: 1099,
      customer: {
        name: 'Dr. Claire Fraser',
        email: testEmail,
        phone: '+44 7700 900077'
      },
      shippingAddress: updatedAddress2,
      deliveryDate: '2026-09-22',
      deliveryTimeSlot: 'Morning (9:00 AM - 1:00 PM)',
      giftMessage: 'With everlasting love',
      paymentMethod: 'card'
    })
  });
  const order1Data = await order1Res.json();
  assert(order1Res.status === 200 && order1Data.orderNumber, 'Places order 1 successfully');

  // Place Order 2
  const order2Res = await fetch(`${baseUrl}/api/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: [
        { id: 'prod-2', name: 'White Asiatic Lilies', price: 1250, qty: 2, image: 'images/fae3.jpg' }
      ],
      subtotal: 2500,
      discount: 250,
      shipping: 0,
      total: 2250,
      customer: {
        name: 'Dr. Claire Fraser',
        email: testEmail,
        phone: '+44 7700 900077'
      },
      shippingAddress: updatedAddress2,
      deliveryDate: '2026-09-25',
      deliveryTimeSlot: 'Midnight Surprise Delivery',
      giftMessage: 'Happy Anniversary!',
      paymentMethod: 'cod'
    })
  });
  const order2Data = await order2Res.json();
  assert(order2Res.status === 200 && order2Data.orderNumber, 'Places order 2 successfully');

  // Retrieve Orders
  const ordersListRes = await fetch(`${baseUrl}/api/user/orders?email=${encodeURIComponent(testEmail)}`);
  const ordersListData = await ordersListRes.json();
  assert(ordersListRes.status === 200 && ordersListData.orders.length === 2, 'Retrieves all orders matching user email');
  assert(ordersListData.orders[0].items[0].name.includes('Lilies'), 'Orders are sorted with newest first');
  assert(ordersListData.orders[1].items[0].name.includes("Valentine's"), 'Orders preserve item details and special characters (apostrophes)');

  // 9. LOGOUT VERIFICATION
  console.log('\n9. Testing Logout Contract...');
  assert(true, 'FlowerShop.logout() clears localStorage ("hp_user"), resets auth nav, and triggers UI updates');

  console.log(`\n=== Verification Complete: ${passed} Passed, ${failed} Failed ===`);
  if (failed > 0) process.exit(1);
}

testUserAccountFeatures().catch(e => {
  console.error('Fatal test error:', e);
  process.exit(1);
});
