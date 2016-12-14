app.controller('singleProjectCtrl', function($scope,$http, $routeParams, $route, $templateCache) {
    console.log('Single Project under control..', $scope.$flow);
    $scope.projectId = $routeParams.projectId;

    $scope.csv_link = '/api/project/' + $scope.projectId + '/download';

    //Getting the image files associated with the project
    $scope.files = [];

    //Image to transcribe
    $scope.imgToTranscribe = undefined;
    //Get the specific project
    $http.get('/api/project/'+$scope.projectId)
    .success(function(data) {
        if(data.length == 0) {
            console.log('Invalid projcet Id');
            res.redirectTo('/');
        } else {
            data = data[0];
            console.log(data);
            data.transcDeadline = new Date(data.transcDeadline);
            data.embargoDate = new Date(data.embargoDate);
            //This has all the details of the project and also the template of the transcribing
            data['schema'] = {"count":1,"fields": [{"i":1,"x":10,"y":10,"w":35,"h":10,"t":"String"},{"i":2,"x":10,"y":10,"w":35,"h":10,"t":"Date"}]};
            $scope.project = data;
        }
    })
    .error(function(err) {
        console.log(err);
    });

    //Get the transcription files for this project
    $http.get('/api/files/'+$routeParams.projectId)
    .success(function(data){
        $scope.files = data;
        console.log(data);
    })
    .error(function(err){
        console.log(err);
    });

    $scope.updateImageFiles = function() {
        console.log('----ooo--');
        $scope.$flow.resume();
        //Updating values of image files
        console.log($scope.$flow.files);
        var newFiles = [];
        for(i in $scope.$flow.files) {
                var postData = {"name":$scope.$flow.files[i]['name'],
                                "identifier":$scope.$flow.files[i]['uniqueIdentifier'],
                                "size" : $scope.$flow.files[i]['size'],
                                "relativePath" : $scope.$flow.files[i]['relativePath'],
                                "projectId" : $scope.project["_id"]};


                $http.post('/api/files',postData)
                .success(function(data){
                    //It internally updates the corresponding project
                   console.log(data);
                   var currentPageTemplate = $route.current.templateUrl;
                   $templateCache.remove(currentPageTemplate);
                   $route.reload();
                })
                .error(function(err){
                    console.log(err);
                });
        }

        $scope.$flow.files = [];
    };

  $scope.$on('flow::filesSubmitted', function (event, $flow, flowFile) {
    $scope.updateImageFiles();
  });
});
