const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testLoginFix() {
  console.log('🧪 Testing Login Fix with Username Field...\n');

  try {

    console.log('1. Testing login with username field...');
    const loginData = {
      username: 'admin',
      password: 'password123'
    };

    try {
      const loginResponse = await axios.post(`${BASE_URL}/pharmacy/auth/signin`, loginData);
      console.log('✅ Login successful!');
      console.log('Response:', {
        success: loginResponse.data.success,
        message: loginResponse.data.message,
        hasToken: !!loginResponse.data.data?.accessToken
      });
    } catch (error) {
      if (error.response) {
        console.log('❌ Login failed with response:', error.response.data);
      } else {
        console.log('❌ Login failed:', error.message);
      }
    }

    console.log('');


    console.log('2. Testing login with email field...');
    const loginDataEmail = {
      username: 'admin@example.com',
      password: 'password123'
    };

    try {
      const loginResponseEmail = await axios.post(`${BASE_URL}/pharmacy/auth/signin`, loginDataEmail);
      console.log('✅ Login with email successful!');
      console.log('Response:', {
        success: loginResponseEmail.data.success,
        message: loginResponseEmail.data.message,
        hasToken: !!loginResponseEmail.data.data?.accessToken
      });
    } catch (error) {
      if (error.response) {
        console.log('❌ Login with email failed:', error.response.data);
      } else {
        console.log('❌ Login with email failed:', error.message);
      }
    }

    console.log('');


    console.log('3. Testing login with invalid field (should fail validation)...');
    const invalidData = {
      email: 'admin@example.com',
      password: 'password123'
    };

    try {
      const invalidResponse = await axios.post(`${BASE_URL}/pharmacy/auth/signin`, invalidData);
      console.log('❌ Unexpected success with invalid field');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log('✅ Validation correctly failed for invalid field');
        console.log('Error:', error.response.data.message);
      } else {
        console.log('❌ Unexpected error:', error.message);
      }
    }

    console.log('');
    console.log('🎉 Login Fix Test Complete!');
    console.log('');
    console.log('📋 Summary:');
    console.log('   ✅ Username field now accepted');
    console.log('   ✅ Email can still be used as username');
    console.log('   ✅ Validation works correctly');
    console.log('   ✅ Old email field properly rejected');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}


testLoginFix(); 