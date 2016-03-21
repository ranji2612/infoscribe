app.controller('singleProjectCtrl', function($scope,$http, $routeParams) {
    console.log('Single Project under control..');
    $scope.projectId = $routeParams.projectId;
    console.log($scope.projectId);
    
    //Get the specific project
    $http.get('/api/project/'+$scope.projectId)
    .success(function(data) {
        if(data.length == 0) {
            console.log('Invalid projcet Id');
            res.redirectTo('/');
        } else {
            data = data[0];
            console.log(data);
            $scope.projectInfo = data;
        }
    })
    .error(function(err) {
        console.log(err);
    })
});