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