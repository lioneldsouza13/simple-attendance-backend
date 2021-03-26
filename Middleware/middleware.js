require('dotenv').config()

const encrypt = require('../Encryption/encrypt')
var validateHeaders = async function (req,res,next){
    var header = req.header('x-auth')
    const enc = req.header('enc')
    
    if(enc == 'true')
    {
        if(header === undefined || header.trim().length ===0 )
        {
            res.status(401).send("Header Missing");
            return  
        }
       header= await encrypt.decryptData(header) 
    }

    if( header!= process.env.header_secret)
    {
        res.status(401).send("Unauthorized");
        return
    }
    next()

}

module.exports ={
    validateHeaders
}