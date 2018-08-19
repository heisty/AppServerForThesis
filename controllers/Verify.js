const firebase = require('firebase');
exports.verify = function(req,res,next){
	let {phoneNumber} = req.body;

	

	var config = {
    apiKey: "AIzaSyBW4K5Tt5itKO3SQ5zmbbFf1dPF1CnBI3Y",
    authDomain: "jnlsalon-3daa4.firebaseapp.com",
    databaseURL: "https://jnlsalon-3daa4.firebaseio.com",
    projectId: "jnlsalon-3daa4",
    storageBucket: "jnlsalon-3daa4.appspot.com",
    messagingSenderId: "862908272237"
  };
  firebase.initializeApp(config);

  



	firebase.auth().signInWithPhoneNumber(phoneNumber,true).then(function (confirmationResult){
		res.json(confirmationResult);
	}).catch(function (error){
		console.log("error",error);
	})
}