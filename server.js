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

// CORS Configuration
const allowedOrigins = ['http://localhost:3000', 'https://prducer.vercel.app']; // Allow local dev and deployed frontend

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true, // If you need to handle cookies or authorization headers
};

app.use(cors(corsOptions)); // Use configured CORS

// Middleware
// app.use(cors()); // Remove the simple CORS usage
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