app.controller('transcribeFileCtrl', function($scope,$http, $routeParams) {
    $scope.projectId = $routeParams.projectId;
    $scope.fileId = $routeParams.fileId;
    $scope.file = {};
    $scope.project = {};

    $http.get('/api/files/' + $scope.projectId + '/file/' + $scope.fileId)
    .success(function(data) {
        $scope.file = data;
        console.log(data);
    })
    .error(function(err) {
        console.log(err);
    });

    $http.get('/api/project/'+$scope.projectId)
    .success(function(data) {
        if(data.length == 0) {
            console.log('Invalid projcet Id');
            res.redirectTo('/');
        } else {
            data = data[0];
            data.transcDeadline = new Date(data.transcDeadline);
            data.embargoDate = new Date(data.embargoDate);
            //This has all the details of the project and also the template of the transcribing
            $scope.project = data;
        }
    })
    .error(function(err) {
        console.log(err);
    });

    console.log('transcribe file under control..', $scope.projectId, $scope.fileId);


    //Once img is loaded draw the boundaries over transcribing regions
    $scope.onTranscImgLoad = function() {

        console.log('Lets draw boundaries', $scope.project.schema.fields);
        console.log(document.getElementById('imgHolder'));
        //Set div height to adjust
        var img = document.getElementById('ti');
        var imgH = document.getElementById('imageHolder');
        //document.getElementById('imgHolder').style.height = img.height + 'px';
        console.log(img.height, imgH,imgH.offsetHeight);


        var canvas=document.getElementById("gameCanvas"),
        ctx = canvas.getContext("2d");

        canvas.width = img.width;
        canvas.height = img.height;

        for(var i=0; i< $scope.project.schema.fields.length;i++) {
          // ctx.fillStyle = "red";
          // ctx.fillRect(10, 40, 90,20);
          data = $scope.project.schema.fields[i];
          ctx.strokeStyle = "#000000";
          ctx.lineWidth   = 2;
          ctx.strokeRect(data.x, data.y, data.w,data.h);
          console.log(data,'====');
        }
    };
});
