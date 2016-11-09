app.controller('transcribeFileCtrl', function($scope,$http, $routeParams) {
    $scope.projectId = $routeParams.projectId;
    $scope.fileId = $routeParams.fileId;
    $scope.file = {};
    $scope.project = {};
    $scope.isImageLoaded = false;
    // Exemplar Logic
    var canvas = document.getElementById('transcribeImage'),
        ctx = canvas.getContext('2d'),
        line = new Line(ctx),
        img = new Image;
    ctx.strokeStyle = '#111';
    ctx.font="20px Tahoma";
    ctx.fillStyle = 'white';
    img.onload = start;
    function Line(ctx) {
      var me = this;

      this.x1 = 0;
      this.x2 = 0;
      this.y1 = 0;
      this.y2 = 0;

      this.draw = function() {
        ctx.beginPath();
        ctx.moveTo(me.x1, me.y1);
        ctx.lineTo(me.x2, me.y2);
        ctx.stroke();
      }
    }

    /* Graph Helper functions */
    function drawLine(x1, y1, x2, y2) {
      line.x1 = x1;
      line.y1 = y1;
      line.x2 = x2;
      line.y2 = y2;
      line.draw();
    }

    function rect(x, y, w, h) {
      drawLine(x,y,x+w,y);
      drawLine(x,y,x,y+h);
      drawLine(x,y+h,x+w,y+h);
      drawLine(x+w,y,x+w,y+h);
    }

    function rectFill(x, y, w, h) {
      if (h<0) {
        y = y + h;
      }
      for(var i=0; i<=Math.abs(h);i++) {
         drawLine(x,y+i,x+w,y+i);
       }
    }

    function rectXY(x1, y1, x2, y2) {
      var w = x2 - x1,
          h = y2 - y1;
      rect(x1,y1, w, h);
    }
    /* Canvas mouse interaction functions */
    function start() {
      ctx.canvas.width  = document.getElementById('canvasHolder').clientWidth;
      ctx.canvas.height = img.height * document.getElementById('canvasHolder').clientWidth / img.width;
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(img, 0, 0, transcribeImage.width, transcribeImage.height);
      $scope.onTranscImgLoad();
    }

    $http.get('/api/files/' + $scope.projectId + '/file/' + $scope.fileId)
    .success(function(data) {
        $scope.file = data;
        img.src = '/api/download/'+ $scope.file.identifier;
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
            // $scope.onTranscImgLoad();
        }
    })
    .error(function(err) {
        console.log(err);
    });

    console.log('transcribe file under control..', $scope.projectId, $scope.fileId);


    //Once img is loaded draw the boundaries over transcribing regions
    $scope.onTranscImgLoad = function() {
      console.log('schema' in $scope.project, !$scope.isImageLoaded);
      if('schema' in $scope.project && !$scope.isImageLoaded) {
        $scope.isImageLoaded = true;
        console.log('Yayyyy');
        for(var i=0; i< $scope.project.schema.length;i++) {
          var pos = $scope.project.schema[i]['pos'];
          pos = pos.map(function(elem){
            return elem * document.getElementById('transcribeImage').width / 500;
          });
          var r = pos,
              x = Math.min(r[0],r[2]),
              y = Math.min(r[1], r[3]);
          // No of the box, box it at the top left corner
          rect(x, y, 11.5, -11.5);
          ctx.fillText((parseInt(i)+1), x+2.5, y-2.5);
          // Actual box
          rectXY(r[0], r[1], r[2], r[3]);
        }
      }
    };
});
