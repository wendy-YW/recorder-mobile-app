const express = require('express');
const router = express.Router();
const projectRecordsController = require('../controllers/projectRecordsController');

// Create new project record
router.post('/create', projectRecordsController.createProjectRecord);

// Update existing project record
router.post('/updateProjectRecord', projectRecordsController.updateProjectRecord);

// Get all project records
router.get('/', projectRecordsController.getAllProjectRecords);

module.exports = router;
