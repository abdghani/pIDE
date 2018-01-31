var path = require('path');
var check = require(path.join(__dirname,'..','service','checkValidObject'));
var fs = require('fs');
var exec = require('exec');
var high = 9999,
	low = 1000;


exports.simpleCompile = function(req,res,next){
	status = false;
	outArray = [];
		var ranNumber = (Math.random() * (high - low) + low).toString().substr(0,4);
		if( !check.isUndefined(req.body.content)){
			var filename = 'data'+ranNumber+'.py'
			fs.writeFile(filename, req.body.content,  function(err) {

			   if (err) {
			   	console.log("er1",err);
			   	fs.unlink(filename, function(){
			       res.send(err);
			       return next();
			    })
			   }
			   else{
			   	exec('python3 '+filename,function(err,out,code){
			   	fs.unlink(filename, function(){

				   	if(err){
					  	   outArray.push(err)
				   	}
				   	if(out){
				   			status = true
				   			outArray.push(out)
					}
					res.send({
						status:status,
						output:outArray
					})
					return next
				})
			   });
			  }
			});
		 }
		 else{
			 res.send({
				 status:false,
				 output:'invalid Code'
			 });
		 }	
};

exports.getPackages = function(req,res,next){
	console.log("reached");
		exec('pip3 freeze',function(err,out,code){
			   	if(err){
					   return next(err);
			   	}
			   	else{
			   		console.log(out);
					res.send(out);
					return next();
				}
		});
};
