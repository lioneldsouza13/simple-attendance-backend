const sqlActivity = require('../SQL_ACTIVITY/crud');
const modules = require('../Modules/modules')
const express = require('express')
var router = express.Router()
const {validateHeaders} = require('../Middleware/middleware')
const encrypt = require('../Encryption/encrypt');
const shops = require('../Modules/Shop/shop')


router.use((req,res,next)=>{
    const ignoreRoutes=[]
     if(!ignoreRoutes.includes(req.path))
     {
         next()
         return
     }
     validateHeaders(req,res,next)
 })
 
 router.post('/addShop',async (req,res)=>{
   // data = JSON.parse(req.body.data)
    data = req.body.data
    if(data === null || data === undefined)
    {
        res.status(401).send({message:'Enter valid Data'})
        return
    }

    const result = await shops.addShop(data)
    res.send(result)

 })


 router.post('/addVendor',async (req,res)=>{
   // data = JSON.parse(req.body.data)
   data = req.body.data
    if(data === null || data === undefined)
    {
        res.status(401).send({message:'Enter valid Data'})
        return
    }

    const result = await shops.addVendor(data)
    res.send(result)

 })

router.post('/getShop',async (req,res)=>{
   // data = JSON.parse(req.body.data)
   data = req.body.data
    if(data === null || data === undefined)
    {
        res.status(401).send({message:'Enter valid Data'})
        return
    }
    
    const result = await shops.getShop(data)
    res.send(result)

})

router.post('/getVendor',async (req,res)=>{
    // data = JSON.parse(req.body.data)
    data = req.body.data
    if(data === null || data === undefined)
    {
        res.status(401).send({message:'Enter valid Data'})
        return
    }
    
    const result = await shops.getVendor(data)
    res.send(result)

})

router.post('/deleteShop',async (req,res)=>{
   // data = JSON.parse(req.body.data)
   data = req.body.data
    if(data === null || data === undefined)
    {
        res.status(401).send({message:'Enter valid Data'})
        return
    }
    
    const result = await shops.deleteShop(data)
    res.send(result)

})



router.post('/deleteVendor',async (req,res)=>{
  // data = JSON.parse(req.body.data)
  data = req.body.data
    if(data === null || data === undefined)
    {
        res.status(401).send({message:'Enter valid Data'})
        return
    }
    
    const result = await shops.deleteVendor(data)
    res.send(result)

})


 module.exports = router 