const encrypt = require('../Encryption/encrypt');
const modules = require('../Modules/modules')


const express = require('express')
var router = express.Router()
const {validateHeaders} = require('../Middleware/middleware')


router.use((req,res,next)=>{
    const ignoreRoutes=[]
     if(ignoreRoutes.includes(req.path))
     {
         next()
         return
     }
     validateHeaders(req,res,next)
 })
 

//ENCRYPT DATA
router.post('/encrypt',async (req,res)=>{
    const data = req.body.data
    if(modules.validateBody(data))
    {
        res.send('Enter a valid data')
        return
    }
    const result =  await encrypt.encryptData(data)
    res.send(result)
})

//DECRYPT DATA
router.post('/decrypt',async (req,res)=>{
    const data = req.body.data
    if(modules.validateBody(data))
    {
        res.send('Enter a valid data')
        return
    }
    try {
        const result =  await encrypt.decryptData(data)
        res.send(result)
    } catch (error) {
        res.send({message:error.message})
    }
   
})


module.exports = router