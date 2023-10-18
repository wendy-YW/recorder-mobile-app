const mongoose = require('mongoose');

const projectRecordSchema = new mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
    },
    user: {
        type: String,

    },
    timeWorked: {
        type: Number,
        required: true,
    },
    items: [
        {
            item: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Item',
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
        },
    ],
});

module.exports = mongoose.model('ProjectRecord', projectRecordSchema);
