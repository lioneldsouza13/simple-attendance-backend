const firebase = require('firebase') 
var admin = require('firebase-admin');

require('dotenv').config()

  // Set the configuration for your app
  // TODO: Replace with your project's config object

  var firebaseConfig = {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    databaseURL: process.env.databaseURL,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId
  };
  
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  // Get a reference to the database service
  var database = firebase.database();


//ADMIN CONFIGURATION
  var serviceAccount ={
    "type": process.env.type_admin,
  "project_id": process.env.project_id_admin,
  "private_key_id": process.env.private_key_id_admin,
  "private_key": process.env.private_key_admin.replace(/\\n/g, '\n'),
  "client_email": process.env.client_email_admin,
  "client_id": process.env.client_id_admin,
  "auth_uri": process.env.auth_uri_admin,
  "token_uri": process.env.token_uri_admin,
  "auth_provider_x509_cert_url": process.env.auth_provider_x509_cert_url_admin,
  "client_x509_cert_url": process.env.client_x509_cert_url_admin
  }
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.databaseURL
  });

  module.exports ={
      database,firebase,admin
  }