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
