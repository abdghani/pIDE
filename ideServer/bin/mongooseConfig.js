
var mongoose = require('mongoose');
var path = require('path');
var config = require(path.join(__dirname,'config'))

var userModel = require(path.join(__dirname,'..','model','users'));
// var projectModel = require(path.join(__dirname,'..','models','projects'));
// var threadModel = require(path.join(__dirname,'..','models','threads'));


module.exports = function () {
    mongoose.connect(config.mongourl);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error...'));
    db.once('open', function callback() {
        console.log('pide db connected');
    });
};
