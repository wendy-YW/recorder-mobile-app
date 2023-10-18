const ProjectRecord = require('../models/projectRecord');

exports.createProjectRecord = (req, res) => {
    console.log('Received a request to create a project record', req.body);

    const projectRecord = req.body;

    const newProjectRecord = new ProjectRecord(projectRecord);

    newProjectRecord.save()
        .then(() => res.json('Project record added!'))
        .catch(err => {
            console.log('Error saving project record:', err);
            res.status(400).json({ message: 'Error: ' + err.message });
        });
};

exports.getAllProjectRecords = (req, res) => {
    ProjectRecord.find()
        .then(projectRecords => res.json(projectRecords))
        .catch(err => res.status(400).json('Error: ' + err));
}

exports.updateProjectRecord = (req, res) => {
    const { projectId, workedHours, items } = req.body;

    ProjectRecord.findOne({ _id: projectId })
        .then(projectRecord => {
            if (!projectRecord) {
                return res.status(404).json({ message: 'Project record not found.' });
            }

            // Update the project record with new worked hours
            projectRecord.timeWorked += workedHours;

            // Update or add new items
            items.forEach(item => {
                const existingItem = projectRecord.items.find(recordedItem => recordedItem.item.equals(item.itemId));
                if (existingItem) {
                    existingItem.quantity += item.quantity;
                } else {
                    projectRecord.items.push({ item: item.itemId, quantity: item.quantity });
                }
            });

            projectRecord.save()
                .then(() => res.json({ message: 'Worked hours and items added successfully.' }))
                .catch(err => {
                    console.log('Error saving project record:', err);
                    res.status(400).json({ message: 'Error: ' + err.message });
                });
        })
        .catch(err => {
            console.log('Error fetching project record:', err);
            res.status(400).json({ message: 'Error: ' + err.message });
        });
};