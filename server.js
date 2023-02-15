const app = require('./app');
const dotenv = require('dotenv');
const path = require('path');
const connectDatabase = require('./config/database');

// Connect database
connectDatabase();
require('dotenv').config({ path: path.resolve(__dirname, 'config', 'config.env')});
app.listen(process.env.PORT, () => {
    console.log(`Server is working on http://localhost:${process.env.PORT}`);
});
