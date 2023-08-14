const express = require('express');
const router = express.Router();
const projectsController = require('../controllers/projectsController');

router.post('/create', projectsController.createProject);
router.get('/', projectsController.getAllProjects);

module.exports = router;
