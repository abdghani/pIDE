var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	userid:{type:String,required:true},
	displayName:{type:String,required:true},
	photoUrl:{type:String,required:true},
	provider:{type:String,required:true},
	projects:[{type:String,required:true}]
});

var userModel = mongoose.model("users",userSchema);
module.exports = userModel;