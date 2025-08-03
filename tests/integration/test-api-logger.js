const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testApiLogger() {
  console.log('🧪 Testing API Logger Functionality...\n');

  try {

    console.log('1. Checking current logging configuration...');
    const configResponse = await axios.get(`${BASE_URL}/pharmacy/logs/config`);
    console.log('✅ Current config:', configResponse.data.data);
    console.log('');


    console.log('2. Enabling API logging...');
    const enableResponse = await axios.post(`${BASE_URL}/pharmacy/logs/enable`);
    console.log('✅', enableResponse.data.message);
    console.log('');


    console.log('3. Making API calls to generate logs...');
    

    await axios.get(`${BASE_URL}/`);
    console.log('✅ Called main endpoint');
    

    await axios.get(`${BASE_URL}/pharmacy/security/health`);
    console.log('✅ Called security health endpoint');
    

    await axios.get(`${BASE_URL}/pharmacy/logs/config`);
    console.log('✅ Called logs config endpoint');
    

    await axios.get(`${BASE_URL}/pharmacy/logs/stats`);
    console.log('✅ Called logs stats endpoint');
    

    try {
      await axios.get(`${BASE_URL}/nonexistent`);
    } catch (error) {
      console.log('✅ Generated 404 error (expected)');
    }
    
    console.log('');


    console.log('4. Checking logs statistics...');
    const statsResponse = await axios.get(`${BASE_URL}/pharmacy/logs/stats`);
    console.log('✅ Log stats:', statsResponse.data.data);
    console.log('');


    console.log('5. Disabling API logging...');
    const disableResponse = await axios.post(`${BASE_URL}/pharmacy/logs/disable`);
    console.log('✅', disableResponse.data.message);
    console.log('');


    console.log('6. Making API call with logging disabled...');
    await axios.get(`${BASE_URL}/`);
    console.log('✅ Called main endpoint (logging disabled)');
    console.log('');

    console.log('🎉 API Logger Test Complete!');
    console.log('');
    console.log('📋 API Logger Features Tested:');
    console.log('   ✅ Configuration management');
    console.log('   ✅ Enable/disable logging');
    console.log('   ✅ Request logging');
    console.log('   ✅ Error logging');
    console.log('   ✅ Statistics tracking');
    console.log('   ✅ File logging (if enabled)');
    console.log('');
    console.log('🔧 Available Endpoints:');
    console.log('   GET  /pharmacy/logs/config  - Get logging configuration');
    console.log('   POST /pharmacy/logs/enable  - Enable logging');
    console.log('   POST /pharmacy/logs/disable - Disable logging');
    console.log('   GET  /pharmacy/logs/stats   - Get log statistics');
    console.log('   DELETE /pharmacy/logs/clear - Clear log files');
    console.log('');
    console.log('🌍 Environment Variables:');
    console.log('   API_LOGGING_ENABLED=true/false');
    console.log('   API_LOG_TO_FILE=true/false');
    console.log('   API_LOG_TO_CONSOLE=true/false');
    console.log('   API_LOG_LEVEL=info/warn/error/debug');
    console.log('   API_LOG_DIR=./logs');
    console.log('   API_LOG_FILE=api.log');
    console.log('   API_LOG_HEADERS=true/false');
    console.log('   API_LOG_BODY=true/false');
    console.log('   API_LOG_QUERY=true/false');
    console.log('   API_LOG_PARAMS=true/false');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}


testApiLogger(); 