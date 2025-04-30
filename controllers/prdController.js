// No longer require openai here
// const openai = require('../config/openai');

// Helper function for OpenAI API calls with retry logic
const makeOpenAIRequest = async (openaiClient, systemPrompt, userPrompt, retries = 3, initialBackoff = 1000) => {
  let lastError;
  
  // Check if openai client is valid
  if (!openaiClient || typeof openaiClient.chat?.completions?.create !== 'function') {
    throw new Error('Invalid OpenAI client provided to makeOpenAIRequest.');
  }
  
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      console.log(`Attempt ${attempt + 1}: Making OpenAI request...`);
      
      const response = await openaiClient.chat.completions.create({
        model: "gpt-4.1-nano",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
      });
      
      return response.choices[0].message.content;
    } catch (error) {
      console.error(`Attempt ${attempt + 1} failed:`, error.message);
      lastError = error;
      
      // If rate limited, wait and retry
      if (error.status === 429) {
        const backoffTime = initialBackoff * Math.pow(2, attempt) * (0.5 + Math.random() * 0.5); // Random between 1-3 seconds with exponential backoff
        console.log(`Rate limited. Retrying in ${backoffTime/1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, backoffTime));
      } else {
        // For other errors, break out of retry loop
        break;
      }
    }
  }
  
  // If we've exhausted our retries or encountered a non-rate-limit error
  throw lastError || new Error('Failed to get response from OpenAI API');
};

// Step 1: Kickoff & Presets
exports.kickoff = async (req, res) => {
  try {
    const { description, usePreset, presetChoice } = req.body;
    const openaiClient = req.app.locals.openaiClient; // Get client from app.locals
    
    const systemPrompt = `You are an AI assistant helping create a Product Requirements Document (PRD).
    Your task is to generate an "## Overview" section based on the user's business challenge description or the selected preset.
    The overview should reframe their problem and vision in a clear, concise manner.
    Respond ONLY with the markdown for the overview section, starting directly with "## Overview". Do not include any other text before or after.`;
    
    let userPrompt;
    if (usePreset) {
      // Find the full preset description based on presetChoice ID
      const presetMap = {
        'sales-chatbot': 'Sales Chatbot – Our sales team struggles to follow up with leads consistently and personalize outreach at scale. We want to create an AI-powered chatbot that can automate initial conversations, qualify leads, and schedule meetings with human sales reps when prospects are ready to buy.',
        'expense-dashboard': 'Expense-Report Dashboard – Our finance team spends too much time processing expense reports and lacks visibility into spending patterns. We need a real-time dashboard that automatically categorizes expenses, flags policy violations, and provides actionable insights on team spending to help control costs.',
        'onboarding-workflow': 'Onboarding Workflow Manager – New employees take too long to become productive because our onboarding process is fragmented across different systems. We want to build a centralized workflow tool that guides new hires through training modules, policy acknowledgments, and team introductions with automated progress tracking.',
        'feedback-collector': 'Customer Feedback Collector – We\'re losing customers without understanding why because we lack a systematic way to gather and analyze feedback. We need an automated system that collects satisfaction surveys after key interactions, analyzes sentiment trends, and routes critical feedback to the appropriate teams for immediate action.'
      };
      const selectedPresetDescription = presetMap[presetChoice] || 'Unknown Preset';
      userPrompt = `Generate an overview for the following preset idea: ${selectedPresetDescription}`;
    } else {
      // Use the user's custom description
      userPrompt = `Generate an overview based on this business challenge description: ${description}`;
    }
    
    try {
      const overviewMarkdown = await makeOpenAIRequest(openaiClient, systemPrompt, userPrompt);
      
      // Send the raw markdown from OpenAI, assuming it includes "## Overview"
      res.json({ 
        success: true, 
        data: { markdown: overviewMarkdown } 
      });
    } catch (error) {
      console.error('Error calling OpenAI:', error.message);
      res.status(500).json({ 
        success: false, 
        error: `OpenAI API Error: ${error.message}` 
      });
    }
  } catch (error) {
    console.error('Error in kickoff:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to process kickoff request' 
    });
  }
};

// Step 2: Overview & Key Features
exports.overview = async (req, res) => {
  try {
    const { currentMarkdown, features } = req.body;
    const openaiClient = req.app.locals.openaiClient; // Get client from app.locals
    
    const systemPrompt = `You are an AI assistant helping create a Product Requirements Document (PRD).
    Your task is to add a "## Key Features" section to the existing PRD markdown based on the features provided.
    Format each feature as a bullet point with a strong title followed by the description.
    Respond only with the complete markdown including both the existing content and the new Key Features section.`;
    
    const userPrompt = `Current PRD markdown:\n${currentMarkdown}\n\nFeatures to add:\n${JSON.stringify(features)}`;
    
    const updatedMarkdown = await makeOpenAIRequest(openaiClient, systemPrompt, userPrompt);
    
    res.json({ 
      success: true, 
      data: { markdown: updatedMarkdown } 
    });
  } catch (error) {
    console.error('Error in overview:', error);
    res.status(500).json({ 
      success: false, 
      error: `Failed to process overview request: ${error.message}`
    });
  }
};

// Step 3: Data Models
exports.dataModels = async (req, res) => {
  try {
    const { currentMarkdown, entities } = req.body;
    const openaiClient = req.app.locals.openaiClient; // Get client from app.locals
    
    const systemPrompt = `You are an AI assistant helping create a Product Requirements Document (PRD).
    Your task is to add a "## Data Models" section to the existing PRD markdown based on the entities provided.
    Explain each entity, what data it contains, and its relationships to other entities if applicable.
    Respond only with the complete markdown including both the existing content and the new Data Models section.`;
    
    const userPrompt = `Current PRD markdown:\n${currentMarkdown}\n\nEntities to add:\n${JSON.stringify(entities)}`;
    
    const updatedMarkdown = await makeOpenAIRequest(openaiClient, systemPrompt, userPrompt);
    
    res.json({ 
      success: true, 
      data: { markdown: updatedMarkdown } 
    });
  } catch (error) {
    console.error('Error in dataModels:', error);
    res.status(500).json({ 
      success: false, 
      error: `Failed to process data models request: ${error.message}`
    });
  }
};

// Step 4: Core Workflows
exports.workflows = async (req, res) => {
  try {
    const { currentMarkdown, workflows } = req.body;
    const openaiClient = req.app.locals.openaiClient; // Get client from app.locals
    
    const systemPrompt = `You are an AI assistant helping create a Product Requirements Document (PRD).
    Your task is to add a "## Workflows" section to the existing PRD markdown based on the workflows provided.
    Format each workflow clearly with numbered steps and arrows to indicate flow direction.
    Respond only with the complete markdown including both the existing content and the new Workflows section.`;
    
    const userPrompt = `Current PRD markdown:\n${currentMarkdown}\n\nWorkflows to add:\n${JSON.stringify(workflows)}`;
    
    const updatedMarkdown = await makeOpenAIRequest(openaiClient, systemPrompt, userPrompt);
    
    res.json({ 
      success: true, 
      data: { markdown: updatedMarkdown } 
    });
  } catch (error) {
    console.error('Error in workflows:', error);
    res.status(500).json({ 
      success: false, 
      error: `Failed to process workflows request: ${error.message}`
    });
  }
};

// Step 5: UI Styling & Inspiration
exports.uiStyling = async (req, res) => {
  try {
    const { currentMarkdown, inspiration } = req.body;
    const openaiClient = req.app.locals.openaiClient; // Get client from app.locals
    
    const systemPrompt = `You are an AI assistant helping create a Product Requirements Document (PRD).
    Your task is to add a "## UI & Styling" section to the existing PRD markdown based on the inspiration provided.
    Describe the visual style, color scheme, layout principles, and other design elements that should guide the frontend development.
    Respond only with the complete markdown including both the existing content and the new UI & Styling section.`;
    
    const userPrompt = `Current PRD markdown:\n${currentMarkdown}\n\nUI Inspiration:\n${inspiration}`;
    
    const updatedMarkdown = await makeOpenAIRequest(openaiClient, systemPrompt, userPrompt);
    
    res.json({ 
      success: true, 
      data: { markdown: updatedMarkdown } 
    });
  } catch (error) {
    console.error('Error in uiStyling:', error);
    res.status(500).json({ 
      success: false, 
      error: `Failed to process UI styling request: ${error.message}`
    });
  }
};

// Step 6: Backend & Frontend Implementation Plans
exports.backendPlan = async (req, res) => {
  try {
    const { currentMarkdown } = req.body;
    const openaiClient = req.app.locals.openaiClient; // Get client from app.locals
    
    const systemPrompt = `You are an AI assistant helping create a Product Requirements Document (PRD).
    Your task is to append BOTH "## Backend Plan" AND "## Frontend Plan" sections to the existing PRD markdown.
    
    For the Backend Plan:
    Provide three clear, actionable steps for implementing the backend based on the PRD content.
    Each step should focus on a specific aspect of backend development with Firebase.
    
    For the Frontend Plan:
    Provide three clear, actionable steps for implementing the frontend based on the PRD content.
    Each step should focus on a specific aspect of React frontend development.
    
    Respond only with the complete markdown including the existing content and BOTH new sections. Ensure the sections are clearly titled "## Backend Plan" and "## Frontend Plan".`;
    
    const userPrompt = `Current PRD markdown:\n${currentMarkdown}`;
    
    const updatedMarkdown = await makeOpenAIRequest(openaiClient, systemPrompt, userPrompt);
    
    res.json({ 
      success: true, 
      data: { markdown: updatedMarkdown } 
    });
  } catch (error) {
    console.error('Error in backend/frontend plan generation:', error);
    res.status(500).json({ 
      success: false, 
      error: `Failed to generate implementation plans: ${error.message}`
    });
  }
};

// Step 8: Finalization & Download
exports.finalize = async (req, res) => {
  try {
    const { currentMarkdown } = req.body;
    
    // No OpenAI call needed here, just return the final markdown
    
    res.json({ 
      success: true, 
      data: { 
        markdown: currentMarkdown,
        downloadReady: true
      } 
    });
  } catch (error) {
    console.error('Error in finalize:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to process finalization request' 
    });
  }
}; 