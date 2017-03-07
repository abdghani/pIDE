var path = require('path');
var express = require('express');
var config = require(path.join(__dirname,'..','bin','config'));
var saveCtrl = require(path.join(__dirname,'..','controller','codeCtrl'));
var router = express.Router();

router.post('/saveCode', saveCtrl.saveCode);
router.post('/updateCode', saveCtrl.updateCode);
router.get('/getAllCode',saveCtrl.getAllCode);
router.post('/deleteCode',saveCtrl.deleteCode);
// router.post('/uploadData',saveCtrl.uploadDataset);
router.post('/getCode',saveCtrl.getCode);

router.post('/uploadCode',saveCtrl.uploadCode);
router.get('/getUploadedCode',saveCtrl.getUploadedCode);
router.post('/deleteUploadedCode',saveCtrl.deleteUploadedCode);

module.exports = router;
