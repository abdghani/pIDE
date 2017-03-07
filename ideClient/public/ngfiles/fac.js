app.factory('myconfig', function(){

  var data = {
      url:"http://localhost:3000",
	  codeUrl:"http://ec2-35-154-124-176.ap-south-1.compute.amazonaws.com:3001",
    // codeUrl:"http://localhost:3001",
	  samplecode:"# sample code\n\nimport numpy as np;\nridership = np.array([\n    [   0,    0,    2,    5,    0],\n    [1478, 3877, 3674, 2328, 2539],\n    [1613, 4088, 3991, 6461, 2691],\n    [1560, 3392, 3826, 4787, 2613],\n    [1608, 4802, 3932, 4477, 2705],\n    [1576, 3933, 3909, 4979, 2685],\n    [  95,  229,  255,  496,  201],\n    [   2,    0,    1,   27,    0],\n    [1438, 3785, 3589, 4174, 2215],\n    [1342, 4043, 4009, 466, 3039]\n])\nprint ridership"
  };
  return data;
});

app.factory('session',function GetSession($http,$q,$rootScope,myconfig){
	var defer = $q.defer();
    $http.get('/login/loggedin')
	.then(function(data){
		if(data.data!='0'){
			$rootScope.currentUser = data.data;
			defer.resolve('done');
		}
		else{
			$rootScope.currentUser = null;
			defer.resolve('done');
		}
	});
    return defer.promise;
});

app.factory('codes', function(myconfig,$rootScope) {
    var userService = {};
    if($rootScope.liveCode === undefined){
    	userService.code = myconfig.samplecode;
    }
    
    userService.changeCode = function (value) {
       $rootScope.liveCode = value;
       userService.code = value;
    };
    return userService;
});
