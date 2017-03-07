var app = angular.module('pide',[
  'ngSanitize',
  'ui.codemirror',
  'angularModalService',
  'ngResource',
  'ngMaterial',
  'ui.router',
  'angularFileUpload',
  'ngClickCopy',
  'angular-filepicker'
  ])

app.run( ['$rootScope', '$state', '$stateParams',
                      function ($rootScope,$location,$state,$stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams; 
}
]);

app.controller('mainCtrl',function($scope,$http,$rootScope,$window,$state,$mdDialog,codes){
  $scope.logout = function(){
    $http.post('/login/logout').then(function(data){
      $window.location.href = "/";
    });
  };
   $scope.openSaved = function(){
            $mdDialog.show({
                       controller: 'savedCtrl',
                       templateUrl: 'partials/savedCode.html',
                       parent: angular.element(document.body),
                       clickOutsideToClose: true,
                       locals: {
                         data: "ss"
                       }
                     })
                     .then(function(result) {
                       if (result) {
                         codes.changeCode(result.content);
                         $rootScope.loadCode();
                         $state.go('home',{codeId:result._id});
                       }
                      });
    };
});

app.controller('LeftCtrl', function ($scope, $timeout, $mdSidenav, $log) {
    $scope.close = function () {
      // Component lookup should always be available since we are not using `ng-if`
      $mdSidenav('left').close()
        .then(function () {
          $log.debug("close LEFT is done");
        });

    };
});
