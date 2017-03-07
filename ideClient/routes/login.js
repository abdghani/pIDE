var path = require('path');
var express = require('express');
var passport = require('passport');
var Strategy = require('passport-facebook').Strategy;
var config = require(path.join(__dirname,'..','bin','config'));
// var passportCtrl = require(path.join(__dirname,'..','controller','passportCtrl'));

var router = express.Router();
router.get('/facebook',passport.authenticate('facebook'));
router.get('/facebook/return',
                            passport.authenticate('facebook', { failureRedirect: '/login', failureFlash: true }),
                            function(req,res,next){
								                      res.redirect('/');
             					                    return next();
             				}
          );

router.get('/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
router.get('/google/callback',
                            passport.authenticate('google', {failureRedirect : '/login'}),
             				  function(req,res,next){
             					// res.send(req.user);
								      res.redirect('/');
             					return next();
             				}
        );
//logout
router.post('/logout',function(req,res){
	req.logout();
	res.redirect('/');
});

router.get('/loggedin',function(req,res){
	res.send(req.isAuthenticated() ? req.user : '0');
});

module.exports = router;
