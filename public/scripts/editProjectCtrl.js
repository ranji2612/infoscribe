app.controller('editProjectCtrl', function($scope,$http, $location, $routeParams) {
    console.log('Edit Project under control..');
    $scope.project = {};
    $scope.oldProjectData = {};
    $http.get('/api/project/'+$routeParams.projectId)
    .success(function(data) {
        if(data.length == 0) {
            console.log('Invalid projcet Id');
            res.redirectTo('/');
        } else {
            data = data[0];
            console.log(data);
            $scope.project =  data;
            $scope.oldProjectData = JSON.parse(JSON.stringify(data));
            $scope.oldProjectData.keywords = $scope.oldProjectData.keywords.join(',');
        
            $('#transcDeadline').datepicker('update', new Date($scope.project.transcDeadline)); 
            $('#embargoDate').datepicker('update', new Date($scope.project.embargoDate)); 
            
        }
    })
    .error(function(err) {
        console.log(err);
    });
    
    //Update
    $scope.updateProject = function() {
        $scope.newValue = JSON.parse(JSON.stringify($scope.project));
        //Date conversion to unix time
        $scope.newValue.transcDeadline = (new Date($scope.project.transcDeadline)).valueOf();
        $scope.newValue.embargoDate = (new Date($scope.project.embargoDate)).valueOf();
        //key-word concatenation
        console.log($scope.newValue.keywords);
        $scope.newValue.keywords = $scope.newValue.keywords[0];
        for(i in $scope.newValue){
            if ($scope.newValue[i] === $scope.oldProjectData[i]) {
                //console.log('same '+i,$scope.project[i] ,$scope.oldProjectData[i]);
                delete $scope.newValue[i];
            }
        }
        
        //Updating values
        console.log($scope.newValue);
        
        
        //Post call
        $http.put('/api/project/'+$scope.oldProjectData["_id"],$scope.newValue)
        .success(function(data){
            console.log(data);
            console.log(data.status);
            if(data.status=="success") {
                $location.path('/project/'+$scope.oldProjectData["_id"]);
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