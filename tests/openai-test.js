require('dotenv').config();
const openai = require('../config/openai');

// Test function to verify OpenAI API connection
async function testOpenAIConnection() {
  console.log('Testing OpenAI API connection...');
  
  try {
    // Check if the API key is defined
    if (!process.env.OPENAI_API_KEY) {
      console.error('❌ Error: OPENAI_API_KEY is not defined in .env file');
      console.log('Please make sure you have created a .env file with your OpenAI API key.');
      return;
    }
    
    console.log('✅ API key found in environment variables');
    
    // Test a simple completion
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-nano",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Say hello to test the OpenAI API connection." }
      ],
    });
    
    console.log('✅ Successfully connected to OpenAI API!');
    console.log('Response:', completion.choices[0].message.content);
  } catch (error) {
    console.error('❌ Error connecting to OpenAI API:', error.message);
    
    if (error.status === 401) {
      console.log('This is likely an authentication error. Check that your API key is correct.');
    } else if (error.status === 429) {
      console.log('You are being rate limited. Please try again later.');
    } else {
      console.log('Error details:', error);
    }
  }
}

// Run the test
testOpenAIConnection(); 