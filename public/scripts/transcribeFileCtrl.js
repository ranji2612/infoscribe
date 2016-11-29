app.controller('transcribeFileCtrl', function($scope,$http, $location, $routeParams) {
    $scope.projectId = $routeParams.projectId;
    $scope.fileId = $routeParams.fileId;
    $scope.file = {};
    $scope.project = {};
    $scope.transResult = {};
    $scope.isImageLoaded = false;
    $scope.rectanglesVisibility = true;
    // Transctiption Logic
    var canvas = document.getElementById('transcribeImage'),
        ctx = canvas.getContext('2d'),
        line = new Line(ctx),
        img = new Image;
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
    function start(event, zoomRatio=0) {
      ctx.canvas.width  = (1+zoomRatio)*document.getElementById('canvasHolder').clientWidth;
      ctx.canvas.height = (1+zoomRatio)*img.height * document.getElementById('canvasHolder').clientWidth / img.width;
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(img, 0, 0, transcribeImage.width, transcribeImage.height);
      $scope.onTranscImgLoad();
    }
    // Get File Details
    $http.get('/api/files/' + $scope.projectId + '/file/' + $scope.fileId)
    .success(function(data) {
        $scope.file = data;
        img.src = '/api/download/'+ $scope.file.identifier;
        console.log(data);
    })
    .error(function(err) {
        console.log(err);
    });
    // Get Project Details
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
            $scope.project.schema.map(function(elem){
              $scope.transResult[elem['no']] = '';
            });
            console.log($scope.transResult);
        }
    })
    .error(function(err) {
        console.log(err);
    });
    // Get Transription details for this file by the user
    $http.get('/api/transcribe/project/'+$scope.projectId+'/file/'+$scope.fileId)
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
            $scope.project.schema.map(function(elem){
              $scope.transResult[elem['no']] = '';
            });
            console.log($scope.transResult);
        }
    })
    .error(function(err) {
        console.log(err);
    });


    //Once img is loaded draw the boundaries over transcribing regions
    $scope.onTranscImgLoad = function() {
      if (!$scope.rectanglesVisibility)
        return;
      console.log($scope.rectanglesVisibility);
      if(('schema' in $scope.project)) {
        $scope.isImageLoaded = true;
        console.log('----Yayyy');
        for(var i=0; i< $scope.project.schema.length;i++) {
          var pos = $scope.project.schema[i]['pos'];
          pos = pos.map(function(elem){
            return elem * document.getElementById('transcribeImage').width / 500;
          });
          var r = pos,
              x = Math.min(r[0],r[2]),
              y = Math.min(r[1], r[3]);
          // No of the box, box it at the top left corner
          ctx.strokeStyle = '#FF0000';
          rect(x, y, 11.5, -11.5);
          ctx.fillText((parseInt(i)+1), x+2.5, y-2.5);
          // Actual box
          ctx.strokeStyle = '#FF0000';
          rectXY(r[0], r[1], r[2], r[3]);
        }
      }
    };

    $scope.checkForm = function(results) {
      // TODO: Check if the types and input matches
      var err = Object.keys(results).map(function(key){
        if (results[key]==='') {
          return "Field "+(parseInt(key)+1)+" is empty"
        }
      });
      return err.filter(function(item){
          return typeof item ==='string';
      });
    };

    $scope.saveTranscription = function() {
      console.log($scope.transResult);
      var err = $scope.checkForm($scope.transResult);
      var errBox = document.getElementById('errBox');
      errBox.style.display = "none"
      errBox.innerHTML = "";
      if (err.length !== 0) {
        // Display the error
        for (var i in err) {
          errBox.innerHTML += err[i] + '<br/>';
        }
        errBox.style.display = "";
      } else {
        var payload = $scope.transResult;
        // Elements to hash
        payload['fileId'] = $scope.fileId;
        payload['projectId'] = $scope.projectId;
        // Save the schema and redirect to the project page
        $http.post('/api/transcribe/', payload)
        .success(function(data){
            console.log(data);
            $location.path('/project/'+$scope.projectId);
        })
        .error(function(err){
            console.log(err);
        });
      }
    };

    // Canvas View Controls
    $scope.zoom =0;
    $scope.zoomCanvas = function(n) {
      console.log(n);
      if (n===0) {
        $scope.zoom = 0;
      } else if (n===1) {
        $scope.zoom += 0.1;
      } else if (n===-1) {
        $scope.zoom -= 0.1;
      }
      start({},$scope.zoom);
    };

    $scope.toggleRectangles = function() {
      console.log($scope.rectanglesVisibility);
      $scope.rectanglesVisibility = !$scope.rectanglesVisibility;
      start({}, $scope.zoom);
    };
});
