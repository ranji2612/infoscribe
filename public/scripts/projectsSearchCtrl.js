app.controller('projectsSearchCtrl', function($scope,$http) {
    console.log('Projects Search under control..');
    $scope.projects = [];
    $scope.getProjects = function() {
        $http.get('/api/project/all')
        .success(function (data){
            $scope.projects = data;
        })
        .error(function(err){
            console.log(err);
        });
    };
    
    $scope.getProjects();
});