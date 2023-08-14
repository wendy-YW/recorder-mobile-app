const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    info: { type: String, required: true },
});

module.exports = mongoose.model('Item', itemSchema);
