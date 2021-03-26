const firebaseConnection = require('./../DatabaseConnection/DBConnection')

//USER SIGN UP
async function signup(email,password){
const result=await firebaseConnection.firebase.auth().createUserWithEmailAndPassword(email, password)
  .then((userCredential) => {
    // Signed up
    var user = userCredential.user;
   const promise= new Promise((resolve,reject)=>{  
    resolve({
        uid:user.uid,
        email:user.email
    })
    })
    return promise
   
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    const promise=  new Promise((resolve,reject)=>{
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
    resolve(error)
})
return promise
});
  return result
}

//DELETE USER
async function deleteUser(email){
  //Checking for valid User
  const user = await getUserByEmail(email);
  if(user.status ==='Failed')
  {
    return user.error
  }
 
  //Deleting Specific User
  const admin = await firebaseConnection.admin
  .auth()
  .deleteUser(user.uid)
  .then(() => {
    return 'Successfully deleted user'
  })
  .catch((error) => {
    return error
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


  module.exports ={
        signup,login,resetPassword,deleteUser
  }