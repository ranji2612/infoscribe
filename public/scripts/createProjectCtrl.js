app.controller('createProjectCtrl', function($scope,$http, $location) {
    console.log('Create Project under control..');
    $('.datepicker').datepicker({
        startDate: '-0d'
    });
    $scope.visibility="public";

    //On Create press
    $scope.createProject = function() {

        //Form data
        var formData = {"name":$scope.name, desc: $scope.desc, visibility:$scope.visibility, transcDeadline:(new Date($scope.transcDeadline)).valueOf(), embargoDate:(new Date($scope.embargoDate)).valueOf(), keywords:$scope.getKeywords()};
        console.log(formData);

        //Post call
        $http.post('/api/project/',formData)
        .success(function(data){
            console.log(data);
            console.log(data.status);
            if(data.status=="success") {
                $location.path('/project/'+data.data._id);
            } else {
                console.log(data);

                $scope.errorMsg = data.message;
            }
        })
        .error(function(err){
            console.log(err);
        });

    };


    $scope.getKeywords = function() {
        var keywords = $scope.keywords.split(',');
        return keywords;
    };
});
