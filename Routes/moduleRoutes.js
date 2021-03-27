const sqlActivity = require('../SQL_ACTIVITY/crud');
const modules = require('../Modules/modules')
const express = require('express')
var router = express.Router()
const {validateHeaders} = require('../Middleware/middleware')
const encrypt = require('../Encryption/encrypt');

router.use((req,res,next)=>{
   const ignoreRoutes=[]
    if(ignoreRoutes.includes(req.path))
    {
        next()
        return
    }
    validateHeaders(req,res,next)
})


//TO INSERT NEW MODULES
router.post('/modules',async (req, res) => {

    var module_name = req.body.moduleName
    var active ='Yes'

    //Check if module name is valid and not empty
    if (modules.validateBody(module_name)) {
        var message={message:"Enter a valid Module name"}
        if(req.header('enc')==='true')
        {
            res.send(await encrypt.encryptData(JSON.stringify(message)))
            return
        }
        res.send(message)
        return
    }

    //Decryption    
    if(req.header('enc')==='true')
    {
        try {
            module_name = await encrypt.decryptData(module_name);
             
        } catch (error) {
            res.send({
                status:'Decryption failed',
                message:error.message
            }) 
           return
        }        
    }

    //Default name
    const collectionName = 'modules'

    //Data to be passed to Firebase
    const data = { module_name, active }

    //Inserting Data into Database
     var result= await  sqlActivity.insertData(data, collectionName).then((response) => {
    return response       
    }).catch((response) => {
        return response
    })

    //Encrypting Data    
    if(req.header('enc')==='true')
    {
        result= await encrypt.encryptData(JSON.stringify(result))
    }
    res.send(result);
})


//TO FETCH ACTIVE MODULES
router.get('/modules',async (req, res) => {
  
    const collectionName = "modules"
    var error=false
    //Fetching Data from Database
    const fetchedData = await sqlActivity.fetchData(collectionName).then((response) => {
        return response
    }).catch((response) => {
        return response
    })

    if(error)
    {
        if(req.header('enc')==='true')
        {
            res.send(await encrypt.encryptData(JSON.stringify(fetchedData)))
            return
        }
        res.send(fetchedData)
        return
    }
    //If no values fetched from server
    if (modules.validateData(fetchedData) ) {
        var message={message:"No Data found"}
        if(req.header('enc')==='true')
        {
            res.send(await encrypt.encryptData(JSON.stringify(message)))
            return
        }
        res.send(message)
        return
    }

    //Creating an Array of result
    var arrangingData = await modules.getActiveModuleData(fetchedData);
   
    //Encrypting Data    
    if(req.header('enc')==='true')
    {
    arrangingData=await encrypt.encryptData(JSON.stringify(arrangingData))
    }
    
    //Sending Result
    res.send(arrangingData)
})


//UDPATE MODULES
router.post('/updateModule',async (req, res) => {

    var module_name = req.body.moduleName
    var active = req.body.active

    //Default name
    const collectionName = 'modules'

    
    //Check if module name is valid and not empty
    if (modules.validateBody(module_name) == true) {
        var message={message:"Enter a valid Module name"}
        if(req.header('enc')==='true')
        {
            res.send(await encrypt.encryptData(JSON.stringify(message)))
            return
        }
        res.send(message)
        return
    }

    //Check if active is not empty (if empty set default value yes)
    if (modules.validateBody(active) == true) {
        var message={message:"Enter a valid status"}
        if(req.header('enc')==='true')
        {
            res.send(await encrypt.encryptData(JSON.stringify(message)))
            return
        }
        res.send(message)
        return
    }

    //Decryption
    if(req.header('enc')==='true')
    {
        try {
            module_name = await encrypt.decryptData(module_name);
            active = await encrypt.decryptData(active)    
        } catch (error) {
            res.send({
                status:'Decryption failed',
                message:error.message
            }) 
           return
        }
    }


    //Data to be passed to Firebase
    const data = { module_name, active }
    let error=false
    //Fetching Data from Database
   const fetchedData=await sqlActivity.fetchData(collectionName).then((response) => {
      return response
    }).catch((response) => {
        error=true
        return response
    })

    if(error)
    {
        if(req.header('enc')==='true')
        {
            res.send(await encrypt.encryptData(JSON.stringify(fetchedData)))
            return
        }
        res.send(fetchedData)
        return
    }

    //Getting keys for data to be updated
    const fetchedKeys=  await modules.getKeyForModule(fetchedData,module_name)

    //Check if any keys found
    const status= fetchedKeys.length===0?true:false
    if(status) 
    {
        var message={message:"No Data Found"}
        if(req.header('enc')==='true')
        {
            res.send(await encrypt.encryptData(JSON.stringify(message)))
            return
        }
        res.send(message)
        return
    }

    //Update data in database
    var updatedResponse;
    const updatedData=async(fetchedKeys,data,collectionName)=>{  
        for(let item of fetchedKeys)
        {
        const newCollectionName=collectionName+"/"+item
        await  sqlActivity.updateData(data,newCollectionName).then((response) => {
            updatedResponse=response
          }).catch((response) => {
            updatedResponse=response
            return
          })
        }
        return updatedResponse
    }

   //Send final status of data 
   var finalResponse= await updatedData(fetchedKeys,data,collectionName)

   //Encrypting Data    
   if(req.header('enc')==='true')
   {
    finalResponse=await encrypt.encryptData(JSON.stringify(finalResponse))
   }
   
    res.send(finalResponse)

})

//DELETING MODULE
router.post('/deleteModule',async (req, res) => {

    var module_name = req.body.moduleName
    var error= false
    //Default name
    const collectionName = 'modules'
    
     //Check if module name is valid and not empty
    if (modules.validateBody(module_name) == true) {
    var message={message:"Enter a valid Module name"}
        if(req.header('enc')==='true')
        {
        res.send(await encrypt.encryptData(JSON.stringify(message)))
        return
        }
    res.send(message)
    return
    }

    //Decryption
    if(req.header('enc')==='true')
    {
        try {
            module_name = await encrypt.decryptData(module_name);
        } catch (error) {
            res.send({
                status:'Decryption failed',
                message:error.message
            }) 
           return
        }
    }


    //Fetching Data from Database
   const fetchedData=await sqlActivity.fetchData(collectionName).then((response) => {
      return response
    }).catch((response) => {
        error=true
        return response
    })
    
    if(error)
    {
        if(req.header('enc')==='true')
        {
            res.send(await encrypt.encryptData(JSON.stringify(fetchedData)))
            return
        }
        res.send(fetchedData)
        return   
    }

    //Getting keys for data to be updated
    const fetchedKeys=  await modules.getKeyForModule(fetchedData,module_name)

    //Check if any keys found
    const status= fetchedKeys.length===0?true:false
    if(status===true) 
    {
        var message={message:"No Data Found"}
        if(req.header('enc')==='true')
        {
            res.send(await encrypt.encryptData(JSON.stringify(message)))
            return
        }
        res.send(message)
        return
    }

    //Update data in database
    const deletedData=async(fetchedKeys,collectionName)=>{  
        var updatedResponse;
        for(let item of fetchedKeys)
        {
        const newCollectionName=collectionName+"/"+item
         await  sqlActivity.deleteData(newCollectionName).then((response) => {
            updatedResponse=response
          }).catch((response) => {
              updatedResponse=response
              return
          })
        }
        return updatedResponse
    }

   //Send final status of data 
   var finalResponse= await deletedData(fetchedKeys,collectionName)
    //Encrypting Data    
    if(req.header('enc')==='true')
    {
     finalResponse=await encrypt.encryptData(JSON.stringify(finalResponse))
    } 
   
   res.send(finalResponse)

})

//GET ALL MODULES
router.get('/allModules',async (req,res)=>{
    const collectionName = "modules"
    var error=false
    //Fetching Data from Database
    const fetchedData = await sqlActivity.fetchData(collectionName).then((response) => {
        return response
    }).catch((response) => {
        error=true
        return response
    })

    if(error)
    {
        if(req.header('enc')==='true')
        {
            res.send(await encrypt.encryptData(JSON.stringify(fetchedData)))
            return
        }
        res.send(fetchedData)
        return   
    }


    //If no values fetched from server
    if (modules.validateData(fetchedData)) {
        var message={message:"No Data Found"}
        if(req.header('enc')==='true')
        {
            res.send(await encrypt.encryptData(JSON.stringify(message)))
            return
        }
        res.send(message)
        return
    }

    //Creating an Array of result
    var arrangingData = await modules.getAllModuleData(fetchedData);

    //Encryption
    if(req.header('enc')==='true')
    {
        arrangingData= await encrypt.encryptData(JSON.stringify(arrangingData))       
    }
    
    //Sending Result
    res.send(arrangingData)
})

module.exports = router