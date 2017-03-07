var mongoose = require('mongoose');
var path = require('path');
var users = mongoose.model('users');

exports.socialTokenReturn = function(accessToken, refreshToken, profile, cb) {
	
    	users.findOne({userid:profile.id},function(err,data){
    		if(err){
    			return cb(err,null);
    		}
    		if(data){
    			if(data.photoUrl === profile.photos[0].value){
    				return cb(null,data);
    			}
    			else{
    				//updating the photo section
    				users.update({userid:profile.id}, {$set:{'photoUrl':profile.photos[0].value}},function(err,data){
									users.findOne({userid:profile.id},function(err,data){
										return cb(null,data);
									});
    							}
    					);
    			}
    		}
    		else{
    				//adding fresh
    				var newtodouser =new users(getNewUser(profile));
    				newtodouser.save(function(err,data){
    					if(err){
    						console.log("error adding new record")
    					}
    					else{
    						users.findOne({userid:profile.id},function(err,data){
		    					return cb(null,data);
		    				});
    					}
    				});
    		}
    	});
};

exports.getAllUsers = function(req,res,next){
    users.find({},{_id:0},function(err,data){
        if(err){
            res.send(err);
        }
        else{
            res.send(data);
        }
    });
};

exports.isLoggedIn =function(req, res, next){
	console.log(req.isAuthenticated());
    if (req.isAuthenticated()){
		console.log("going to next");
		return next();
	} 
    else{
		res.send("not logged in");
		return next({
			reason:"user not logged in"
		});
	}
};

function getNewUser(profile){
	return {
		userid:profile.id,
		displayName:profile.displayName,
		photoUrl:profile.photos[0].value,
		provider:profile.provider
	};
}