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
  
    const collectionName = "modules"

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


//UDPATE MODULES
app.post('/api/updateModule', async (req, res) => {

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

    //Fetching Data from Database
   const fetchedData=await sqlActivity.fetchData(collectionName).then((response) => {
      return response
    }).catch((response) => {
        res.send(response);
        return
    })
    
    //Getting keys for data to be updated
    const fetchedKeys=  await modules.getKeyForModule(fetchedData,module_name)

    //Check if any keys found
    const status= fetchedKeys.length===0?true:false
    if(status===true) 
    {
    res.send("No Data Found");    
    return
    }

    //Update data in database
    const updatedData=async(fetchedKeys,data,collectionName)=>{  
        var updatedResponse=""
        for(let item of fetchedKeys)
        {
        const newCollectionName=collectionName+"/"+item
         await  sqlActivity.updateData(data,newCollectionName).then((response) => {
            updatedResponse="Data Successfully Updated"
          }).catch((response) => {
              updatedResponse=response
              return
          })
        }
        return updatedResponse
    }

   //Send final status of data 
   const finalResponse= await updatedData(fetchedKeys,data,collectionName)
    res.send(finalResponse)

})

//DELETING MODULE
app.post('/api/deleteModule', async (req, res) => {

    const module_name = req.body.moduleName

    //Default name
    const collectionName = 'modules'

    //Check if module name is valid and not empty
    if (modules.validateBody(module_name) == true) {
        res.send("Enter a valid Module name")
        return
    }

    //Fetching Data from Database
   const fetchedData=await sqlActivity.fetchData(collectionName).then((response) => {
      return response
    }).catch((response) => {
        res.send(response);
        return
    })
    
    //Getting keys for data to be updated
    const fetchedKeys=  await modules.getKeyForModule(fetchedData,module_name)

    //Check if any keys found
    const status= fetchedKeys.length===0?true:false
    if(status===true) 
    {
    res.send("No Data Found");    
    return
    }

    //Update data in database
    const deletedData=async(fetchedKeys,collectionName)=>{  
        var updatedResponse=""
        for(let item of fetchedKeys)
        {
        const newCollectionName=collectionName+"/"+item
         await  sqlActivity.deleteData(newCollectionName).then((response) => {
            updatedResponse="Data Successfully Removed"
          }).catch((response) => {
              updatedResponse=response
              return
          })
        }
        return updatedResponse
    }

   //Send final status of data 
   const finalResponse= await deletedData(fetchedKeys,collectionName)
    res.send(finalResponse)

})


app.get('/api/allModules',async (req,res)=>{
    const collectionName = "modules"

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
    const arrangingData = await modules.getAllModuleData(fetchedData);

    //Sending Result
    res.send(arrangingData)
})

app.listen(PORT, (req, res) => {
    console.log(`Listening on port ${PORT}`);
})