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

app.config(function($stateProvider, $urlRouterProvider,filepickerProvider) {

    $urlRouterProvider.otherwise('/home/');

    $stateProvider
        .state('home', {
            url: '/home/:codeId',
            templateUrl: '/partials/home.html',
            controller:'homeCtrl'
        })
        .state('new', {
            url: '/new',
            templateUrl: '/partials/home.html',
            controller:'homeCtrl'
        })
        .state('upload', {
            url: '/upload',
            templateUrl: '/partials/codeupload.html',
            controller:'uploadCtrl'
        })
        .state('about', {
            url: '/about',
            templateUrl: '/partials/about.html'
        })
        .state('packages', {
            url: '/packages',
            templateUrl: '/partials/packages.html',
            controller:'packagesCtrl'
        })
        .state('save', {
            url: '/save',
            templateUrl: '/partials/savedCode.html',
            controller:'savedCtrl'
        })
        .state('api', {
            url: '/api',
            templateUrl: '/partials/api.html'
        });
        filepickerProvider.setKey('AynkfxksOQNSa83fviAQKz');
});

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

app.controller('LeftCtrl', function ($scope, $timeout, $mdSidenav, $log) {
    $scope.close = function () {
      // Component lookup should always be available since we are not using `ng-if`
      $mdSidenav('left').close()
        .then(function () {
          $log.debug("close LEFT is done");
        });

    };
})

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


app.controller('homeCtrl',function ($scope,$http,$state,$rootScope,$mdToast,$stateParams,$mdDialog,myconfig,codes,session) {

          //auto redirection to homepage
          if("sa",$state.current.name === 'new'){
            $state.go('home');
          }

          //load user code in rootscope variable
          $rootScope.loadCode = function(){
            $scope.code=codes.code; 
          };
          
          $rootScope.loadCode();

          //load code 
          if($stateParams.codeId && $stateParams.codeId.length !== 0){
              $scope.showSave = true;
              var codeId = $stateParams.codeId;
              $http.post('/code/getCode',{codeId : String(codeId)}).then(function(data){
                if(data.data){
                  codes.changeCode(data.data.content);
                  $scope.code = data.data.content;
                }
              });
          }
          else{
            $scope.showSave = false;
          }


        //code mirror options
         $scope.editorOptions = {
                lineWrapping : false,
                lineNumber: false,
                mode: 'python',
                theme:'twilight',
                autofocus : true,
                autoCloseBrackets: true,
                indentWithTabs : true,
                smartIndent : true,
                extraKeys: {
                  "F11": function(cm) {
                    cm.setOption("fullScreen", !cm.getOption("fullScreen"));
                  },
                  "Esc": function(cm) {
                    if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
                  },
                  "Ctrl-Space": "autocomplete"
                }
         };

         function lengthCheck (x){
              if(x !== undefined && x.length > 0){
                return true;
              }
              else{
                return false;
              }
         }

         
         $scope.baseUrl = myconfig.url;

         //saves user code
         $rootScope.saveCode = function(){
             if(lengthCheck($scope.code)){
                  if($stateParams.codeId && $stateParams.codeId.length !== 0){
                      var codePayload = {
                          codeId:$stateParams.codeId,
                          code:$scope.code
                      };
                      $http.post('/code/updateCode',codePayload).then(function(data){
                        console.log(data);
                        $scope.showSimpleToast("code saved");
                      });
                  }
                  else{
                      showSavedCodeModalOpen();
                  }
               }
             else{
                 $scope.showSimpleToast("enter something");
             }
         };

         //resets pressent code
         $rootScope.reset = function(){
           if(lengthCheck($scope.code)){
              if(codes.code.length > 0){
                var confirm = $mdDialog.confirm()
                  .title('RESET')
                  .textContent('You will loose your present code . Please save it')
                  .ariaLabel('Lucky day')
                  .ok('Please Reset')
                  .cancel('Ok Got it');
                  $mdDialog.show(confirm).then(function() {
                    $scope.code = '';
                  }, function() {
                  });
              } 
           }
         };
         
        //change suser code
        $scope.changeUserCode = function(code){
          codes.changeCode(code);
        }; 

         //RUN THE CODE
         $rootScope.run = function(runnableCode){
           var code = {
             content:runnableCode
           };
           var callDate = new Date();
           $http.post(myconfig.codeUrl+'/compile/simpleCompile',code).then(function(success){

             var sec = ((new Date())-callDate)/1000;
             if(success.data.status === true){
               $scope.showSimpleToast("success"+" "+sec+" secs");
             }
             else{
               $scope.showSimpleToast("failure"+" "+sec+" secs");
             }
             if(success.data.output.length == 2)
                $scope.output = success.data.output[0].concat(['\n'],success.data.output[1])
             else
                $scope.output = success.data.output[0]
           });
         };


         $scope.showSimpleToast = function(msg) {
                   $mdToast.show(
                     $mdToast.simple()
                           .textContent(msg)
                           .action('OK')
                           .highlightAction(false)
                  );
         };
         function showSavedCodeModalOpen(){
           $mdDialog.show({
                       controller: 'codeSaveCtrl',
                       templateUrl: 'saveModal.html',
                       parent: angular.element(document.body),
                       clickOutsideToClose: true,
                       locals: {
                         data: $scope.code
                       }
                     })
                     .then(function(result) {
                       if (result) {

                       }
                     });
         }

         //get a new editor 
         $scope.newEditor = function(){
           var confirm = $mdDialog.confirm()
                  .title('RESET')
                  .textContent('Save your pressent code .')
                  .ariaLabel('Lucky day')
                  .ok('ALready saved')
                  .cancel('cancel');
                    $mdDialog.show(confirm).then(function() {
                        $scope.code = '';
                        $state.go('new');
                    }, function() {
                  });
         };
    });

app.controller('savedCtrl',function($rootScope,$scope,$location,$http,$mdDialog,session){
   
   $rootScope.loadUserCode = function(){
     $http.get('/code/getAllCode').then(function(data){
       $scope.allCode = data.data;
     });
   };

   if($rootScope.currentUser){
     $rootScope.loadUserCode();
   }

   $scope.minimizeCode = function(note,limit){
    if(note.length>limit){
      return note.substr(0,limit)+' .....';
    }
    else{
      return note;
    }
  };

  $scope.getShareLink = function(id){
    var host = $location.host();
    if(host == 'localhost'){
      url = "http://localhost:3000/#!/home/"+id
    }
    else{
      url = host+"/#!/home/"+id;
    }

    $mdDialog.show({
                       template: '<md-content><h2>'+url+'<md-button  class="md-primary md-raised" ng-click-copy="'+url+'">Copy</md-button></h2></md-content>',
                       parent: angular.element(document.body),
                       clickOutsideToClose: true,
                       locals: {
                         data: $scope.code
                       }
                     })
                     .then(function(result) {
                       if (result) {}

                     });
  };

  $scope.cancel = function(){
    $mdDialog.hide();
  };
  $scope.delete = function(code,index){
    $http.post('/code/deleteCode',{codeId:code._id}).then(function(result){
      $scope.allCode.splice(index,1);
    });
  };
  $scope.load = function(code){
    $mdDialog.hide(code);
  };
});

app.controller('packagesCtrl',function($scope,$http,myconfig){
	var url = myconfig.codeUrl+'/compile/packages';
	$http.get(url).then(function(result){
		$scope.packages = result.data.split(/\n/);
		console.log($scope.packages);
		$scope.packages.splice($scope.packages.length-1,1);
	});
});
app.controller('uploadCtrl', function ($scope,$http, filepickerService,$rootScope,$mdToast,$mdDialog,$location,session) {
    	$scope.upload = function(){
            filepickerService.pick(
                {
                    // mimetype: 'image/*',
                    language: 'en',
                    services: ['COMPUTER','DROPBOX','GOOGLE_DRIVE','IMAGE_SEARCH', 'FACEBOOK', 'INSTAGRAM'],
                    openTo: 'IMAGE_SEARCH'
                },
                function(file){
                    console.log(file);
                    if(file.mimetype == "text/csv"){
                        var fileUpload = {
                            name:file.filename,
                            size:file.size,
                            link:file.url,
                            userId:$rootScope.currentUser.userid,
                            state:"Idle"
                        }
                        $http.post('/code/uploadCode',fileUpload).then(function(data){
                            getUploadedCode();
                        })
                    }
                    else{
                        $scope.showSimpleToast("please upload a csv file");
                    }
                    
                }
            );
	    };

        function getUploadedCode(){
            $http.get('/code/getUploadedCode').then(function(data){
                $scope.uploadedCodes = data.data;
            })
        }


        $scope.getShareLink = function(url){
            $mdDialog.show({
                            template: '<md-content><h2>'+url+'<md-button  class="md-primary md-raised" ng-click-copy="'+url+'">Copy</md-button></h2></md-content>',
                            parent: angular.element(document.body),
                            clickOutsideToClose: true,
                            locals: {
                                data: "scope.code"
                            }
                            })
                            .then(function(result) {
                            if (result) {}

                            });
        };

        $scope.delete = function(setId,index){
            $http.post('/code/deleteUploadedCode',{codeId:setId}).then(function(data){
                if(data.data.ok == 1){
                    $scope.uploadedCodes.splice(index,1);
                    $scope.showSimpleToast("dataset deleted");
                }
            })
        };

        

        $scope.showSimpleToast = function(msg) {
                   $mdToast.show(
                     $mdToast.simple()
                           .textContent(msg)
                           .action('OK')
                           .highlightAction(false)
                  );
        };
            getUploadedCode();
});