// Middleware to check if OpenAI client is initialized
const checkApiClient = (req, res, next) => {
  const openaiClient = req.app.locals.openaiClient;
  
  if (!openaiClient || typeof openaiClient.chat?.completions?.create !== 'function') {
    console.error('API request failed: OpenAI client is not properly initialized.');
    return res.status(500).json({
      success: false,
      error: 'OpenAI Service Unavailable. The server administrator needs to configure the OpenAI API key.'
    });
  }
  
  // OpenAI client exists and looks valid, proceed
  next();
};

module.exports = checkApiClient; 