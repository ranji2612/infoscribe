app.controller('editProjectCtrl', function($scope,$http, $location, $routeParams) {
    console.log('Edit Project under control..');
    
    $('.datepicker').datepicker({
        startDate: '-3d'
    });
    
    $scope.project = {};
    $scope.files = [];
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
    
    
    //Get the transcription files for this project
    $http.get('/api/files/'+$routeParams.projectId)
    .success(function(data){
        $scope.files = data;
        console.log(data);
    })
    .error(function(err){
        console.log(err);
    });
    
    
    $scope.obj={};
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
        
        //Add the image files
        $scope.updateImageFiles();
        
        //Update the no of docs
        $scope.newValue.nod -= $scope.$flow.files.length;
        
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
    
    $scope.removeImage = function(n) {
        console.log(n,'------');
        
        $http.put('/api/files/'+$scope.project._id,{"identifier":$scope.files[n].identifier})
        .success(function(data){ 
            $scope.files.splice(n,1);
            console.log('Its removed..'); 
        })
        .error(function(err) { console.log(err); });
    };
    
    $scope.updateImageFiles = function() {
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
                })
                .error(function(err){
                    console.log(err);
                });
        }  
    };
    
    $scope.goToNormalPage = function() {
        document.location='/project/'+ $scope.project._id;
    };
    
});