var passport = require('passport');
var path = require('path');
var passport_google = require('passport-google-oauth').OAuth2Strategy;
var passport_facebook = require('passport-facebook').Strategy;
var userCtrl = require(path.join(__dirname,'..','controller','userCtrl'));
var mongoose = require('mongoose');
var auth = require(path.join(__dirname,'config'));

module.exports = {
	newpassportfacebook : new passport_facebook({
	    clientID:auth.facebook.id,
	    clientSecret:auth.facebook.secret,
	    callbackURL: auth.facebook.callback,
	    profileFields: ['id', 'displayName', 'photos', 'email']
	  },userCtrl.socialTokenReturn),
	  
    newpassportgoogle : new passport_google({
	    clientID:auth.google.id,
	    clientSecret:auth.google.secret,
	    callbackURL: auth.google.callback,
	    profileFields: ['id', 'displayName', 'photos', 'email']
	  },userCtrl.socialTokenReturn),

	serialize:function(user,done){
		done(null,user);
	},

	deserialize:function(user,done){
		done(null,user);
	}
};