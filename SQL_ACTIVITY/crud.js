const firebaseConnection = require('./../DatabaseConnection/DBConnection')

//INSERT DATA INTO DATABASE BASED ON COLLECTION NAME
const insertData = (data,collectionName) => {
    const pushData = firebaseConnection.database.ref('/' + collectionName);
    const promise = new Promise((resolve, reject) => {
        pushData.push(data).then((response) => {
            resolve("Data Saved Successfully");
        }).catch((response) => {
            reject(response)
        })
    })
    return promise
}


//FETCH DATA FROM DATABASE BASED ON COLLECTION NAME
const fetchData =(collectionName)=>{
    const pushData = firebaseConnection.database.ref('/' + collectionName);
    const promise = new Promise((resolve, reject) => {
      pushData.once("value").then((snapshot)=>{
            resolve(snapshot.val())
        }).catch((response) => {
            reject(response)
        })
    })
    return promise
}


module.exports = {
    insertData,fetchData
}