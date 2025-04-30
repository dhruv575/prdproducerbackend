const express = require('express');
const router = express.Router();
const prdController = require('../controllers/prdController');
const checkApiClient = require('../middleware/apiKey');

// Apply middleware to all routes
router.use(checkApiClient);

// Route for kickoff & presets (Step 1)
router.post('/kickoff', prdController.kickoff);

// Route for overview & key features (Step 2)
router.post('/overview', prdController.overview);

// Route for data models (Step 3)
router.post('/data-models', prdController.dataModels);

// Route for core workflows (Step 4)
router.post('/workflows', prdController.workflows);

// Route for UI styling & inspiration (Step 5)
router.post('/ui-styling', prdController.uiStyling);

// Route for backend & frontend implementation plans (Step 6)
router.post('/backend-plan', prdController.backendPlan);

// Route for finalization & download (Step 8 - now effectively Step 7)
router.post('/finalize', prdController.finalize);

module.exports = router; 