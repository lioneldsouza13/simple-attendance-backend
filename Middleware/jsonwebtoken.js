const jwt = require('jsonwebtoken')
require('dotenv').config()


async function createToken(data){
    const result = await jwt.sign(data,process.env.jwt_secret,{expiresIn:'1h'});
    return result
}

async function decodeToken(data){
    const result= await jwt.decode(data,process.env.jwt_secret)
    return result
}

module.exports = {createToken,decodeToken}