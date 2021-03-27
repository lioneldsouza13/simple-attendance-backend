const modules = require('../Modules/modules')
const login = require('../Login/login')
const express = require('express')
var router = express.Router()
const {validateHeaders} = require('../Middleware/middleware')
const encrypt = require('../Encryption/encrypt');
const jwt = require('../Middleware/jsonwebtoken')
router.use((req,res,next)=>{
    const ignoreRoutes=[]
    if(ignoreRoutes.includes(req.path))
    {
        next()
        return
    }
    validateHeaders(req,res,next)

})


//SIGNUP
router.post('/signup',async (req,res)=>{
    var email = req.body.email
    var password = req.body.password   
   
   
    if(modules.validateBody(email) || modules.validateBody(password))
    {
        var message={message:"Enter a valid email and password"}
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
               email = await encrypt.decryptData(email);
               password = await encrypt.decryptData(password);
           } catch (error) {
               res.send({
                   status:'Decryption failed',
                   message:error.message
               }) 
              return
           }
       }
   
   //SAVE USER IN DATABASE
   var result=await login.signup(email,password)
   
   var token = await jwt.createToken({uid:result.uid})
   result.token=token
   //Encryption
   if(req.header('enc')==='true')
   {
       result=await encrypt.encryptData(JSON.stringify(result))
   }
   
   res.send(result)
   })
   
   
   //LOGIN
   router.post('/login',async (req,res)=>{
       var email = req.body.email
       var password = req.body.password   
   
       
      if(modules.validateBody(email) || modules.validateBody(password))
      {
       var message={message:"Enter a valid email and password"}
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
               email = await encrypt.decryptData(email);
               password = await encrypt.decryptData(password);
           } catch (error) {
               res.send({
                   status:'Decryption failed',
                   message:error.message
               }) 
              return
           }
       }
   
      //VALIDATE USER
      var result=await login.login(email,password)
      var token = await jwt.createToken({uid:result.uid})
      result.token=token 

      //Encryption
      if(req.header('enc')==='true')
       {
       result=await encrypt.encryptData(JSON.stringify(result))
       }
   
      res.send(result)
      })
   
   //Reset Password
   router.post('/resetPassword',async(req,res)=>{
       var email= req.body.email
   
       if(modules.validateBody(email))
       {
           var message={message:"Enter a valid email"}
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
               email = await encrypt.decryptData(email);
           } catch (error) {
               res.send({
                   status:'Decryption failed',
                   message:error.message
               }) 
              return
           }
       }
     
       //SEND RESET PASSWORD LINK
       var result = await login.resetPassword(email)
       
       //Decryption
       if(req.header('enc')==='true')
       {
       result=await encrypt.encryptData(JSON.stringify(result))
       }
       res.send(result)
   })
   
   
   //Delete User
   router.post('/deleteUser',async(req,res)=>{
       var email =req.body.email
   
       if(modules.validateBody(email))
       {
           var message={message:"Enter a valid email"}
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
               email = await encrypt.decryptData(email);
           } catch (error) {
               res.send({
                   status:'Decryption failed',
                   message:error.message
               }) 
              return
           }
       }
   
   
       //VALIDATE AND DELETE USER
       var result = await login.deleteUser(email);
   
       //Encryption
       if(req.header('enc')==='true')
       {
       result=await encrypt.encryptData(JSON.stringify(result))
       }
       res.send(result)
   })
   
module.exports = router