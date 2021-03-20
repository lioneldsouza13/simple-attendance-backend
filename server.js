//REQUIRED IMPORTS
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

//REQUIRED FILES
const sqlActivity = require('./SQL_ACTIVITY/crud');
const modules = require('./Modules/modules')
//PORT TO BE USED
const PORT = process.env.PORT || 3001;

//ACCEPT JSON FORMAT DATA
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//ALLOW CROSS COMMUNICATION BETWEEN APPS
app.use(cors());

//TO READ DATA FROM .ENV FILE
require('dotenv').config()

//TO INSERT NEW MODULES
app.post('/api/modules', (req, res) => {

    const module_name = req.body.moduleName
    var active = req.body.active

    //Default name
    const collectionName = 'modules'

    //Check if module name is valid and not empty
    if (modules.validateBody(module_name) == true) {
        res.send("Enter a valid Module name")
        return
    }

    //Check if active is not empty (if empty set default value yes)
    active = active == null || active.trim() == "" ? 'Yes' : active

    //Data to be passed to Firebase
    const data = { module_name, active }

    //Inserting Data into Database
    sqlActivity.insertData(data, collectionName).then((response) => {
        res.send(response);
    }).catch((response) => {
        res.send(response);
    })
})


//TO FETCH ACTIVE MODULES
app.get('/api/modules', async (req, res) => {
  
    const collectionName = req.body.collectionName

    //Check for valid Collection name
    if (modules.validateBody(collectionName) == true) {
        res.send("Collection name is missing");
        return
    }
    //Fetching Data from Database
    const fetchedData = await sqlActivity.fetchData(collectionName).then((response) => {
        return response
    }).catch((response) => {
        res.send(response);
    })

    //If no values fetched from server
    if (modules.validateData(fetchedData) == true) {
        res.send("No Data found")
        return
    }

    //Creating an Array of result
    const arrangingData = await modules.getActiveModuleData(fetchedData);

    //Sending Result
    res.send(arrangingData)
})


app.listen(PORT, (req, res) => {
    console.log(`Listening on port ${PORT}`);
})