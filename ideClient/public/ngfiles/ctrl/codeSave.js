app.controller('codeSaveCtrl',function($scope,$http,$mdToast,$mdDialog,$rootScope,data,session){
    $scope.cancel = function(){
        $mdDialog.hide();
    };
    $scope.code = data;

    function lengthCheck (x){
        if(x !== undefined && x.length > 0){
            return true;
        }
        else{
            return false;
        }
    }

    $scope.save = function(){
      if($rootScope.currentUser ){

            if(lengthCheck($scope.code) && lengthCheck($scope.codeName)){
                var codePayload = {
                    userid:$rootScope.currentUser.userid,
                    name:$scope.codeName,
                    content:$scope.code,
                    description:$scope.description
                };
                $http.post('/code/saveCode',codePayload).then(function(res){
                   $mdDialog.hide();
                   $scope.showSimpleToast("code saved");
                });
            }
        }
    };

    $scope.showSimpleToast = function(msg) {
                   $mdToast.show(
                     $mdToast.simple()
                           .textContent(msg)
                           .action('OK')
                           .highlightAction(false)
                  );
    };
});
