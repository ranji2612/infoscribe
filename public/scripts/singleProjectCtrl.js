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
    
    //On click transcribe image set - and initiate the modal
    $scope.transcribeImage = function(file) {
        $scope.imgToTranscribe = file;
        //console.log(file);
        //Set div height to adjust
        var img = document.getElementById('ti'); 
        var imgH = document.getElementById('imgHolder'); 
        //document.getElementById('imgHolder').style.height = img.height + 'px';
        console.log(img.height, img.offsetWidth);
    };
    
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

        ctx.fillStyle = "red";
        ctx.fillRect(10, 40, 90,20);
        /*
        var c=document.getElementById("myCanvas");
        c.style.width = document.getElementById('imageHolder')
        var ctx=c.getContext("2d");
        var img=document.getElementById("ti");  
        ctx.drawImage(img,0,0);  
        var canvas = document.getElementById('myCanvas');
        var context = canvas.getContext('2d');

        context.beginPath();
        context.rect(188, 50, 200, 100);
        context.fillStyle = 'yellow';
        context.fill();
        context.lineWidth = 7;
        context.strokeStyle = 'black';
        context.stroke();
        */
        /*
        for(i in $scope.project.schema.fields) {
            
        }
        */
    };
    
   
});
