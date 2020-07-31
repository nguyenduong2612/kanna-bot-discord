var admin = require('firebase-admin')
var serviceAccount = require('./firebaseSecret.json');

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://werewolf-f09a9.firebaseio.com"
});

//const database = admin.firestore();

module.exports = admin;
