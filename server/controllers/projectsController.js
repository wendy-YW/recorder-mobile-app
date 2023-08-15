const Project = require('../models/project.js');

exports.createProject = (req, res) => {
    console.log('Received a request to create a project', req.body);

    const project = req.body;

    const newProject = new Project(project);

    newProject.save()
        .then(() => res.json('Project added!'))
        .catch(err => {
            console.log('Error saving project:', err);
            res.status(400).json({ message: 'Error: ' + err.message });
        });
};

exports.getAllProjects = (req, res) => {
    Project.find()
        .then(projects => res.json(projects))
        .catch(err => res.status(400).json('Error: ' + err));
}
