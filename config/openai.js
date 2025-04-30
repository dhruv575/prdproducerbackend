const { OpenAI } = require('openai');

// Function to initialize the OpenAI client
const initializeOpenAI = (apiKey) => {
  if (!apiKey) {
    console.error('Error initializing OpenAI: API key is missing.');
    // Return a mock client or null to indicate failure
    return {
      chat: {
        completions: {
          create: async () => {
            throw new Error('OpenAI API key was missing during initialization');
          }
        }
      }
    };
  }

  try {
    const client = new OpenAI({ apiKey });
    console.log('OpenAI client initialized successfully in config.');
    return client;
  } catch (error) {
    console.error('Error initializing OpenAI client in config:', error.message);
    // Return a mock client or null to indicate failure
    return {
      chat: {
        completions: {
          create: async () => {
            throw new Error('Failed to initialize OpenAI client during config');
          }
        }
      }
    };
  }
};

module.exports = { initializeOpenAI }; 