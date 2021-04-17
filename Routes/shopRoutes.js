const sqlActivity = require('../SQL_ACTIVITY/crud');
const modules = require('../Modules/modules')
const express = require('express')
var router = express.Router()
const {validateHeaders} = require('../Middleware/middleware')
const encrypt = require('../Encryption/encrypt');
const shops = require('../Modules/Shop/shop')


router.use((req,res,next)=>{
    const ignoreRoutes=[]
     if(ignoreRoutes.includes(req.path))
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
    const statusCode = result.statusCode === undefined ? 200 :result.statusCode
    res.status(statusCode).send(result)

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
    const statusCode = result.statusCode === undefined ? 200 :result.statusCode
    res.status(statusCode).send(result)

 })

 router.post('/addProduct',async (req,res)=>{
    // data = JSON.parse(req.body.data)
    data = req.body.data
     if(data === null || data === undefined)
     {
         res.status(401).send({message:'Enter valid Data'})
         return
     }
 
     const result = await shops.addProduct(data)
     const statusCode = result.statusCode === undefined ? 200 :result.statusCode
     res.status(statusCode).send(result)
 
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
    const statusCode = result.statusCode === undefined ? 200 :result.statusCode
    res.status(statusCode).send(result)
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
    const statusCode = result.statusCode === undefined ? 200 :result.statusCode
    res.status(statusCode).send(result)

})

router.post('/getProduct',async (req,res)=>{
    // data = JSON.parse(req.body.data)
    data = req.body.data
    if(data === null || data === undefined)
    {
        res.status(401).send({message:'Enter valid Data'})
        return
    }
    
    const result = await shops.getProduct(data)
    const statusCode = result.statusCode === undefined ? 200 :result.statusCode
    res.status(statusCode).send(result)

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
    const statusCode = result.statusCode === undefined ? 200 :result.statusCode
    res.status(statusCode).send(result)

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
    const statusCode = result.statusCode === undefined ? 200 :result.statusCode
    res.status(statusCode).send(result)

})

router.post('/deleteProduct',async (req,res)=>{
    // data = JSON.parse(req.body.data)
    data = req.body.data
     if(data === null || data === undefined)
     {
         res.status(401).send({message:'Enter valid Data'})
         return
     }
     
     const result = await shops.deleteProduct(data)
     const statusCode = result.statusCode === undefined ? 200 :result.statusCode
    res.status(statusCode).send(result)
 
 })


 router.post('/addShopData',async(req,res)=>{
    data = req.body.data
    if(data === null || data === undefined)
    {
        res.status(401).send({message:'Enter valid Data'})
        return
    }

    const result = await shops.addShopData(data)
    const statusCode = result.statusCode === undefined ? 200 :result.statusCode
   res.status(statusCode).send(result)
 })



 
 router.post('/getShopData',async(req,res)=>{
    data = req.body.data
    if(data === null || data === undefined)
    {
        res.status(401).send({message:'Enter valid Data'})
        return
    }

    const result = await shops.getShopData(data)
    const statusCode = result.statusCode === undefined ? 200 :result.statusCode
   res.status(statusCode).send(result)
 })


 
 router.post('/deleteShopData',async(req,res)=>{
    data = req.body.data
    if(data === null || data === undefined)
    {
        res.status(401).send({message:'Enter valid Data'})
        return
    }

    const result = await shops.deleteShopData(data)
    const statusCode = result.statusCode === undefined ? 200 :result.statusCode
   res.status(statusCode).send(result)
 })

 module.exports = router 