const express = require('express')
var router = express.Router()
const {validateHeaders} = require('../Middleware/middleware')
const {createToken,decodeToken} = require('../Middleware/jsonwebtoken')
router.use((req,res,next)=>{
    const ignoreRoutes=['/decode']
    if(ignoreRoutes.includes(req.path))
    {
        next()
        return
    }
    validateHeaders(req,res,next)

})


router.post('/token',async (req,res)=>{
    
    res.send(await createToken(req.body.data))
})
router.post('/decode',async(req,res)=>{
    res.send(await decodeToken(req.body.data))
})

module.exports = router
