
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
