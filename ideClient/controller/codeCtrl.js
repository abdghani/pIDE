var path = require('path');
var check = require(path.join(__dirname,'..','service','checkValidObject'));
var fs = require('fs');
var mongoose = require('mongoose');
var codeModel = mongoose.model('codes');
var uploadCode = mongoose.model('uploadCode')
var multer = require('multer');
var ObjectId = require('mongoose').Types.ObjectId;

var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now());
  }
});

var upload = multer({ storage : storage}).single('userPhoto');

//save a code in database
exports.saveCode = function(req,res,next){
    codeModel.create(req.body,function(err,data){
            if(err){
                return next(err);
            }
            res.send(req.body);
            return next();
    });
   
};
//update an existing code
exports.updateCode = function(req,res,next){
    codeModel.update(
        {_id:req.body.codeId},
        {$set:{content:req.body.code}},
        function(err,data){
        if(err){
            return next(err);
        }
        else{
            res.send(data);
            return next();
        }
    });
};
//get all code for a user
exports.getAllCode = function(req,res,next){
    codeModel.find({userid:req.user.userid},function(err,data){
        if(err){
            return next(err);
        }
        res.send(data);
        return next();
    });
};
//delete a code
exports.deleteCode = function(req,res,next){
	codeModel.remove({_id:req.body.codeId},function(err,data){
        if(err){
            return next(err);
        }
		res.send(data);
		return next();
	});
};
//get a particular code
exports.getCode = function(req,res,next){
var query = {_id:new ObjectId(req.body.codeId)};
   codeModel.findOne(query,function(err,data){
        if(err){
            return next(err);
        }
        res.send(data);
        return next();
    });
};

//save Uploaded code
exports.uploadCode = function(req,res,next){
    uploadCode.create(req.body,function(err,data){
        if(err){
            return next(err);
        }
        res.send(data);
        return next();
    })
};

//getAll uploadedCode 
exports.getUploadedCode = function(req,res,next){
    if(req.user){
        uploadCode.find({userId:req.user.userid},{},function(err,data){
            if(err){
                return next(err);
            }

            res.send(data);
            return next();
        })
    }
    else{
        res.send([]);
        return next();
    }
};

exports.deleteUploadedCode = function(req,res,next){
    uploadCode.remove({_id:req.body.codeId},function(err,data){
        if(err){
            return next(err);
        }

        res.send(data);
        return next();
    })
};