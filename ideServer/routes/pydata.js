var express = require('express');
var router = express.Router();
var path = require('path');
var compile = require(path.join(__dirname,'..','controller','compile'));
/* GET home page. */

router.post('/simpleCompile', compile.simpleCompile);

router.get('/packages',compile.getPackages)

module.exports = router;
