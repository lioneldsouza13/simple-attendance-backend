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
   var httpStatus =403
   
    if(modules.validateBody(email) || modules.validateBody(password))
    {
        var message={message:"Enter a valid email and password"}
        if(req.header('enc')==='true')
        {
            res.status(401).send(await encrypt.encryptData(JSON.stringify(message)))
            return
        }
        res.status(401).send(message)
        return
    }
    
   
   
    //Decryption
    if(req.header('enc')==='true')
       {
           try {
               email = await encrypt.decryptData(email);
               password = await encrypt.decryptData(password);
           } catch (error) {
               res.status(401).send({
                   status:'Decryption failed',
                   message:error.message
               }) 
              return
           }
       }
   
   //SAVE USER IN DATABASE
   var result=await login.signup(email,password)
   var token
     if(!result.status)
     {
        token = await jwt.createToken({uid:result.uid})
        result.token=token
        httpStatus=200
     }

   //Encryption
   if(req.header('enc')==='true')
   {
       result=await encrypt.encryptData(JSON.stringify(result))
   }
   
   res.status(httpStatus).send(result)
   })
   
   
   //LOGIN
   router.post('/login',async (req,res)=>{
       var email = req.body.email
       var password = req.body.password   
        var httpStatus =403
      if(modules.validateBody(email) || modules.validateBody(password))
      {
       var message={message:"Enter a valid email and password"}
           if(req.header('enc')==='true')
           {
               res.status(401).send(await encrypt.encryptData(JSON.stringify(message)))
               return
           }
           res.status(401).send(message)
           return
      }
   
       //Decryption
       if(req.header('enc')==='true')
       {
           try {
               email = await encrypt.decryptData(email);
               password = await encrypt.decryptData(password);
           } catch (error) {
               res.status(401).send({
                   status:'Decryption failed',
                   message:error.message
               }) 
              return
           }
       }
   
      //VALIDATE USER
      var result=await login.login(email,password)
      var token;
      if(!result.status)
      {
        token = await jwt.createToken({uid:result.uid})
        result.token=token 
        httpStatus =200
      }
      //Encryption
      if(req.header('enc')==='true')
       {
       result=await encrypt.encryptData(JSON.stringify(result))
       }

      res.status(httpStatus).send(result)
      })
   
   //Reset Password
   router.post('/resetPassword',async(req,res)=>{
       var email= req.body.email
        
       if(modules.validateBody(email))
       {
           var message={message:"Enter a valid email"}
           if(req.header('enc')==='true')
           {
               res.status(401).send(await encrypt.encryptData(JSON.stringify(message)))
               return
           }
           res.status(401).send(message)
           return
       }
   
       //Decryption
       if(req.header('enc')==='true')
       {
           try {
               email = await encrypt.decryptData(email);
           } catch (error) {
               res.status(401).send({
                   status:'Decryption failed',
                   message:error.message
               }) 
              return
           }
       }
     
       //SEND RESET PASSWORD LINK
       var result = await login.resetPassword(email)
       
       const httpStatus = result.status === true ? 403:200

       //Decryption
       if(req.header('enc')==='true')
       {
       result=await encrypt.encryptData(JSON.stringify(result))
       }
       res.status(httpStatus).send(result)
   })
   
   
   //Delete User
   router.post('/deleteUser',async(req,res)=>{
       var uid =req.body.uid
   
       if(modules.validateBody(uid))
       {
           var message={message:"Enter a valid UID"}
           if(req.header('enc')==='true')
           {
               res.status(401).send(await encrypt.encryptData(JSON.stringify(message)))
               return
           }
           res.status(401).send(message)
           return
       }
   
       //Decryption
       if(req.header('enc')==='true')
       {
           try {
               uid = await encrypt.decryptData(uid);
           } catch (error) {
               res.status(401).send({
                   status:'Decryption failed',
                   message:error.message
               }) 
              return
           }
       }
   
   
       //VALIDATE AND DELETE USER
       var result = await login.deleteUser(uid);
       var httpStatus = result.status === 'Error' ? 403 :200
       //Encryption
       if(req.header('enc')==='true')
       {
       result=await encrypt.encryptData(JSON.stringify(result))
       }
       res.status(httpStatus).send(result)
   })
   

   router.post('/refreshToken',async (req,res)=>{
   var email = req.body.email
    if(req.header('enc')==='true')
    {
        try {
            email = await encrypt.decryptData(email);
        } catch (error) {
            res.status(401).send({
                status:'Decryption failed',
                message:error.message
            }) 
           return
        }
    }
     res.status(200).send(await login.refreshJWTToken(email))
})



module.exports = router