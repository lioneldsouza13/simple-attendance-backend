//REQUIRED IMPORTS
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

//REQUIRED FILES
var loginRoutes = require('./Routes/loginRoutes')
var moduleRoutes = require('./Routes/moduleRoutes')
var encryptionRoutes = require('./Routes/encryptRoutes')
var jwtRoutes = require('./Routes/jsonwebtokenRoutes')

//PORT TO BE USED
const PORT = process.env.PORT || 3001;

//ACCEPT JSON FORMAT DATA
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//ALLOW CROSS COMMUNICATION BETWEEN APPS
app.use(cors());

//TO READ DATA FROM .ENV FILE
require('dotenv').config()

//LOGIN ROUTES
app.use('/api/loginRoutes',loginRoutes)

//MODULE ROUTES
app.use('/api/moduleRoutes',moduleRoutes)

// ENCRYTION/DECRYPTION ROUTES
app.use('/api/encryptionRoutes',encryptionRoutes)

//JWT TESTING
app.use('/api/jwt',jwtRoutes)

app.listen(PORT, (req, res) => {
    console.log(`Listening on port ${PORT}`);
})