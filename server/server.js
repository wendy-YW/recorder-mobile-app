require('dotenv').config();
require('express-async-errors');
console.log(process.env.MONGODB_URI);
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
// const bodyParser = require('body-parser');

const projectsRouter = require('./routes/projects');
const itemsRouter = require('./routes/items');
const projectRecordsRouter = require('./routes/projectRecords');


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB...');
        // mongoose.connection.useDb('recorder');
        // Start the Express server after the database connection is established
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => console.error('Could not connect to MongoDB...', err));

// Routes

app.use('/api/projects', projectsRouter);
app.use('/api/items', itemsRouter);
app.use('/api/projectRecords', projectRecordsRouter);


app.get('/', (req, res) => {
    res.send('Hello World!');
});


// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
