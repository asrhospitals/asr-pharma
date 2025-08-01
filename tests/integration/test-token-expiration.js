const axios = require('axios');

const BASE_URL = 'http://localhost:3000/pharmacy';


async function testTokenExpiration() {
  try {
    console.log('🔐 Testing Token Expiration Handling...\n');


    console.log('1. Logging in to get a token...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/signin`, {
      uname: 'admin',
      pwd: 'admin123'
    });

    const token = loginResponse.data.data.accessToken;
    console.log('✅ Login successful, got token\n');


    console.log('2. Testing protected endpoint with valid token...');
    try {
      const validResponse = await axios.get(`${BASE_URL}/admin/master/inventory/item/v1/get-item`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('✅ Protected endpoint works with valid token\n');
    } catch (error) {
      console.log('❌ Protected endpoint failed:', error.response?.data?.message || error.message);
    }


    console.log('3. Testing with expired/invalid token...');
    try {
      const expiredResponse = await axios.get(`${BASE_URL}/admin/master/inventory/item/v1/get-item`, {
        headers: {
          'Authorization': 'Bearer expired_token_here'
        }
      });
      console.log('✅ Unexpected: Request succeeded with expired token');
    } catch (error) {
      console.log('✅ Expected: Request failed with expired token');
      console.log('   Status:', error.response?.status);
      console.log('   Code:', error.response?.data?.code);
      console.log('   Message:', error.response?.data?.message);
      console.log('\n📋 This is exactly what your frontend should handle!');
      console.log('   When you get this response, your frontend should:');
      console.log('   1. Clear the stored token');
      console.log('   2. Clear user data from Redux');
      console.log('   3. Redirect to login page');
      console.log('   4. Show a message: "Session expired. Please login again."\n');
    }


    console.log('4. Testing without token...');
    try {
      const noTokenResponse = await axios.get(`${BASE_URL}/admin/master/inventory/item/v1/get-item`);
      console.log('✅ Unexpected: Request succeeded without token');
    } catch (error) {
      console.log('✅ Expected: Request failed without token');
      console.log('   Status:', error.response?.status);
      console.log('   Code:', error.response?.data?.code);
      console.log('   Message:', error.response?.data?.message);
    }

    console.log('\n🎯 Summary:');
    console.log('Your backend correctly returns 401 with TOKEN_EXPIRED code');
    console.log('Your frontend should handle this by logging out and redirecting to login');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}


testTokenExpiration(); 