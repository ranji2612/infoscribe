app.controller('singleProjectCtrl', function($scope,$http, $routeParams) {
    console.log('Single Project under control..');
    $scope.projectId = $routeParams.projectId;
    console.log($scope.projectId);
    
    $scope.files = [];
    
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