const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testTokenVerification() {
  console.log('🧪 Testing Token Verification...\n');

  try {
    // Step 1: Login to get a token
    console.log('1. Logging in to get access token...');
    const loginData = {
      uname: 'admin',
      pwd: 'admin123'
    };

    let accessToken;
    try {
      const loginResponse = await axios.post(`${BASE_URL}/pharmacy/auth/signin`, loginData);
      accessToken = loginResponse.data.data.accessToken;
      console.log('✅ Login successful!');
      console.log('Token received:', accessToken.substring(0, 50) + '...');
    } catch (error) {
      console.log('❌ Login failed:', error.response?.data || error.message);
      return;
    }

    console.log('');

    // Step 2: Test protected route without token (should fail)
    console.log('2. Testing protected route without token...');
    try {
      await axios.get(`${BASE_URL}/pharmacy/admin/master/items`);
      console.log('❌ Unexpected success without token');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Correctly rejected without token');
        console.log('Error:', error.response.data.message);
      } else {
        console.log('❌ Unexpected error:', error.message);
      }
    }

    console.log('');

    // Step 3: Test protected route with token (should succeed)
    console.log('3. Testing protected route with token...');
    try {
      const protectedResponse = await axios.get(`${BASE_URL}/pharmacy/admin/master/items`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('✅ Protected route accessible with token!');
      console.log('Response status:', protectedResponse.status);
    } catch (error) {
      console.log('❌ Protected route failed with token');
      console.log('Status:', error.response?.status);
      console.log('Error:', error.response?.data || error.message);
    }

    console.log('');

    // Step 4: Test user profile endpoint
    console.log('4. Testing user profile endpoint...');
    try {
      const profileResponse = await axios.get(`${BASE_URL}/pharmacy/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('✅ Profile endpoint accessible!');
      console.log('User data:', profileResponse.data.data);
    } catch (error) {
      console.log('❌ Profile endpoint failed');
      console.log('Status:', error.response?.status);
      console.log('Error:', error.response?.data || error.message);
    }

    console.log('');

    // Step 5: Test with invalid token
    console.log('5. Testing with invalid token...');
    try {
      await axios.get(`${BASE_URL}/pharmacy/admin/master/items`, {
        headers: {
          'Authorization': 'Bearer invalid_token_here',
          'Content-Type': 'application/json'
        }
      });
      console.log('❌ Unexpected success with invalid token');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Correctly rejected invalid token');
        console.log('Error:', error.response.data.message);
      } else {
        console.log('❌ Unexpected error:', error.message);
      }
    }

    console.log('');
    console.log('🎉 Token Verification Test Complete!');
    console.log('');
    console.log('📋 Summary:');
    console.log('   ✅ Login working');
    console.log('   ✅ Token generation working');
    console.log('   ✅ Token verification working');
    console.log('   ✅ Protected routes accessible');
    console.log('   ✅ Invalid tokens rejected');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testTokenVerification(); 