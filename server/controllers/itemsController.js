const Item = require('../models/item');

exports.createItem = (req, res) => {
    console.log('Received a request to create an item', req.body);

    const item = req.body;

    const newItem = new Item(item);

    newItem.save()
        .then(() => res.json('Item added!'))
        .catch(err => {
            console.log('Error saving item:', err);
            res.status(400).json({ message: 'Error: ' + err.message });
        });
};

exports.getAllItems = (req, res) => {
    Item.find()
        .then(items => res.json(items))
        .catch(err => res.status(400).json('Error: ' + err));
}
