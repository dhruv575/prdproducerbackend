const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { initializeOpenAI } = require('./config/openai'); // Import the initializer
const prdRoutes = require('./routes/prd');

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Initialize express app
const app = express();

// Initialize OpenAI client
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.error('FATAL ERROR: OPENAI_API_KEY environment variable is not set. Cannot start server.');
  // Optionally exit the process if the API key is critical
  // process.exit(1);
} else {
  console.log('OpenAI API key found, initializing client...');
  app.locals.openaiClient = initializeOpenAI(apiKey); // Store client on app.locals
}

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('PRD Producer API is running!');
});

// Use PRD routes
app.use('/api/prd', prdRoutes);

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 