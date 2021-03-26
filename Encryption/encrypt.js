const crypto = require('crypto-js')
require('dotenv').config()

async function encryptData(data){
    const result = await crypto.AES.encrypt(data,process.env.secret).toString()
    return result
}


async function decryptData(data){
    const result = await crypto.AES.decrypt(data,process.env.secret).toString(crypto.enc.Utf8)
    return result
}

module.exports ={
    encryptData,decryptData
}