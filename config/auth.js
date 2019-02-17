// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

	'facebookAuth' : {
		'clientID' 		: '511919255958317', // your App ID
		'clientSecret' 	: '579702274ea678ba5ae4d4bc259c07e4', // your App Secret
		'callbackURL' 	: 'https://localhost:8000/auth/facebook/callback'
	},

	'twitterAuth' : {
		'consumerKey' 		: 'your-consumer-key-here',
		'consumerSecret' 	: 'your-client-secret-here',
		'callbackURL' 		: 'http://localhost:8080/auth/twitter/callback'
	},

	'googleAuth' : {
		'clientID' 		: '163815304205-ldgh18f5tjiiqjr7o17i7q5344v8s1ed.apps.googleusercontent.com',
		'clientSecret' 	: 'vr9H8S07oKlJEwOY7E7AfVzV',
		'callbackURL' 	: "http://localhost:8000/auth/google/callback"
	}

}