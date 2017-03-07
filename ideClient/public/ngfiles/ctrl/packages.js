app.controller('packagesCtrl',function($scope,$http,myconfig){
	var url = myconfig.codeUrl+'/compile/packages';
	$http.get(url).then(function(result){
		$scope.packages = result.data.split(/\n/);
		console.log($scope.packages);
		$scope.packages.splice($scope.packages.length-1,1);
	});
});