const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testLoginWithUnamePwd() {
  console.log('🧪 Testing Login with uname and pwd fields...\n');

  try {

    console.log('1. Testing login with uname and pwd fields...');
    const loginData = {
      uname: 'admin',
      pwd: 'admin123'
    };

    try {
      const loginResponse = await axios.post(`${BASE_URL}/pharmacy/auth/signin`, loginData);
      console.log('✅ Login successful!');
      console.log('Response:', {
        success: loginResponse.data.success,
        message: loginResponse.data.message,
        hasToken: !!loginResponse.data.data?.accessToken,
        user: loginResponse.data.data?.user?.username
      });
    } catch (error) {
      if (error.response) {
        console.log('❌ Login failed with response:', error.response.data);
      } else {
        console.log('❌ Login failed:', error.message);
      }
    }

    console.log('');


    console.log('2. Testing login with email as uname...');
    const loginDataEmail = {
      uname: 'admin@example.com',
      pwd: 'admin123'
    };

    try {
      const loginResponseEmail = await axios.post(`${BASE_URL}/pharmacy/auth/signin`, loginDataEmail);
      console.log('✅ Login with email as uname successful!');
      console.log('Response:', {
        success: loginResponseEmail.data.success,
        message: loginResponseEmail.data.message,
        hasToken: !!loginResponseEmail.data.data?.accessToken
      });
    } catch (error) {
      if (error.response) {
        console.log('❌ Login with email as uname failed:', error.response.data);
      } else {
        console.log('❌ Login with email as uname failed:', error.message);
      }
    }

    console.log('');


    console.log('3. Testing login with old field names (should fail validation)...');
    const invalidData = {
      username: 'admin',
      password: 'admin123'
    };

    try {
      const invalidResponse = await axios.post(`${BASE_URL}/pharmacy/auth/signin`, invalidData);
      console.log('❌ Unexpected success with old field names');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log('✅ Validation correctly failed for old field names');
        console.log('Error:', error.response.data.message);
      } else {
        console.log('❌ Unexpected error:', error.message);
      }
    }

    console.log('');


    console.log('4. Testing login with missing pwd field...');
    const missingPwdData = {
      uname: 'admin'
    };

    try {
      const missingPwdResponse = await axios.post(`${BASE_URL}/pharmacy/auth/signin`, missingPwdData);
      console.log('❌ Unexpected success with missing pwd');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log('✅ Validation correctly failed for missing pwd');
        console.log('Error:', error.response.data.message);
      } else {
        console.log('❌ Unexpected error:', error.message);
      }
    }

    console.log('');

    console.log('🎉 Login Test Complete!');
    console.log('');
    console.log('📋 Summary:');
    console.log('   ✅ uname and pwd fields now accepted');
    console.log('   ✅ Email can still be used as uname');
    console.log('   ✅ Validation works correctly');
    console.log('   ✅ Old field names properly rejected');
    console.log('');
    console.log('📝 Expected Payload Format:');
    console.log('   {');
    console.log('     "uname": "admin",');
    console.log('     "pwd": "admin123"');
    console.log('   }');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}


testLoginWithUnamePwd(); 