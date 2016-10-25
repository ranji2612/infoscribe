app.controller('singleProjectCtrl', function($scope,$http, $routeParams) {
    console.log('Single Project under control..');
    $scope.projectId = $routeParams.projectId;

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

});
