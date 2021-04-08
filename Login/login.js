const firebaseConnection = require('./../DatabaseConnection/DBConnection')
const {createToken,decodeToken} = require('../Middleware/jsonwebtoken')
//USER SIGN UP
async function signup(email,password){
const result=await firebaseConnection.firebase.auth().createUserWithEmailAndPassword(email, password)
  .then((userCredential) => {
    // Signed up
    var user = userCredential.user;
   const promise= new Promise((resolve,reject)=>{  
    resolve({
        uid:user.uid,
        email:user.email,
    })
    })
    return promise
   
  })
  .catch((error) => {
    const promise=  new Promise((resolve,reject)=>{
      error.status=true
        resolve(error)
    })
    return promise
   
  });
  
  return result
}

//USER LOGIN
async function login(email,password){
    const result=await firebaseConnection.firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;
      // ...
   
      const promise= new Promise((resolve,reject)=>{  
        resolve({
            uid:user.uid,
            email:user.email
        })
    })
    return promise
    })
    .catch((error) => {
      const promise=  new Promise((resolve,reject)=>{
        error.status=true
        resolve(error)
    })
    return promise
    });
    return result
}

//USER RESET PASSWORD
async function resetPassword(email){

 const result= await firebaseConnection.firebase.auth().sendPasswordResetEmail(email).then(function() {
  // Email sent.
  const promise= new Promise((resolve,reject)=>{  
    resolve({
      status:"Reset Mail sent"
    })
    })
return promise
}).catch(function(error) {
  const promise= new Promise((resolve,reject)=>{  
    error.status=true
    resolve(error)
})
return promise
});
  return result
}

//DELETE USER
async function deleteUser(uid){
  //Checking for valid User
 // const user = await getUserByEmail(email);
  const user ={
    uid:uid
  }
  // if(user.status ==='Failed')
  // {
  //   return user
  // }
 
  //Deleting Specific User
  const admin = await firebaseConnection.admin
  .auth()
  .deleteUser(user.uid)
  .then(() => {
    const message = {message:'User Deleted Successfully'}
    return message
    
  })
  .catch((error) => {
    const message = {status:'Error',message : error.message}
    return message
  });
  return admin
}

//FETCH USER BY EMAIL ID
async function getUserByEmail(email){
  const admin = await firebaseConnection.admin
  .auth()
  .getUserByEmail(email)
  .then((userRecord) => {
   const user={
     status:"Success",
     uid:userRecord.uid
   }
    return user
  })
  .catch((error) => {
    const user={
      status:"Failed",
      error:error.message
    }
    return user
  });

  return admin
}

async function refreshJWTToken(email){
  const user = await getUserByEmail(email);
 
   if(user.status ==='Failed')
   {
    return user
  }

  var token = await createToken({uid:user.uid})
  user.token=token 
  return token
}


  module.exports ={
        signup,login,resetPassword,deleteUser,refreshJWTToken
  }