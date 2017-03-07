var mongoose = require('mongoose');
var uploadCodeSchema = mongoose.Schema({
    name:{type:String,required:true},
    size:{type:Number,required:true},
    link:{type:String,required:true},
    userId:{type:String,required:true},
    state:{type:String},
    created_at:{type:Date,default:Date.now()},
    lastRan:{type:Date,default:null}
})
module.exports = mongoose.model('uploadCode',uploadCodeSchema);