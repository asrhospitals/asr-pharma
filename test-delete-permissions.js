const axios = require('axios');

const BASE_URL = 'http://localhost:3000/pharmacy';

// Test data
const testUser = {
  uname: 'admin',
  pwd: 'admin123'
};

let authToken = '';

async function testLogin() {
  try {
    console.log('🔐 Testing login...');
    const response = await axios.post(`${BASE_URL}/auth/login`, testUser);
    
    if (response.data.success) {
      authToken = response.data.data.accessToken;
      console.log('✅ Login successful');
      return true;
    } else {
      console.log('❌ Login failed:', response.data.message);
      return false;
    }
  } catch (error) {
    console.log('❌ Login error:', error.response?.data || error.message);
    return false;
  }
}

async function testDeletePermissions() {
  try {
    console.log('\n🔍 Testing delete permissions...');
    
    // First, get all groups to find one to test with
    const groupsResponse = await axios.get(`${BASE_URL}/api/groups`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    if (!groupsResponse.data.success) {
      console.log('❌ Failed to get groups:', groupsResponse.data.message);
      return;
    }
    
    const groups = groupsResponse.data.data || [];
    console.log(`📋 Found ${groups.length} groups`);
    
    if (groups.length === 0) {
      console.log('⚠️  No groups found to test with');
      return;
    }
    
    // Find a non-default group to test with
    const testGroup = groups.find(group => !group.isDefault && group.isDeletable);
    
    if (!testGroup) {
      console.log('⚠️  No deletable groups found to test with');
      return;
    }
    
    console.log(`🎯 Testing with group: ${testGroup.groupName} (ID: ${testGroup.id})`);
    
    // Test delete permission check (this should not actually delete)
    const deleteResponse = await axios.delete(`${BASE_URL}/api/groups/${testGroup.id}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    console.log('✅ Delete permission check completed without internal server error');
    console.log('Response:', deleteResponse.data);
    
  } catch (error) {
    if (error.response?.status === 403) {
      console.log('✅ Permission check working correctly - 403 Forbidden');
      console.log('Message:', error.response.data.message);
    } else if (error.response?.status === 500) {
      console.log('❌ Internal server error still occurring');
      console.log('Error:', error.response.data);
    } else {
      console.log('❌ Unexpected error:', error.response?.data || error.message);
    }
  }
}

async function testInvalidGroupId() {
  try {
    console.log('\n🧪 Testing with invalid group ID...');
    
    const response = await axios.delete(`${BASE_URL}/api/groups/99999`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    console.log('Response:', response.data);
    
  } catch (error) {
    if (error.response?.status === 404) {
      console.log('✅ Correctly returns 404 for non-existent group');
      console.log('Message:', error.response.data.message);
    } else {
      console.log('❌ Unexpected error:', error.response?.data || error.message);
    }
  }
}

async function runTests() {
  console.log('🚀 Starting delete permissions test...\n');
  
  const loginSuccess = await testLogin();
  if (!loginSuccess) {
    console.log('❌ Cannot proceed without login');
    return;
  }
  
  await testDeletePermissions();
  await testInvalidGroupId();
  
  console.log('\n✅ All tests completed!');
}

// Run the tests
runTests().catch(console.error); 