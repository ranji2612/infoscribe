app.controller('exemplarCtrl', function($scope,$http, $location, $routeParams) {
    console.log('exemplar under control..');
    $scope.projectId = $routeParams.projectId;
    $scope.fileId = $routeParams.fileId;
    $scope.file = {};
    $scope.project = {};
    $scope.savedRectangles = [];
    $scope.fields = [[1,2,3]];


    // Exemplar Logic
    var canvas = document.getElementById('exemplarImage'),
        ctx = canvas.getContext('2d'),
        line = new Line(ctx),
        img = new Image;

    ctx.strokeStyle = '#111';
    ctx.font="20px Tahoma";
    ctx.fillStyle = 'white';
    img.onload = start;

    var isDrawing = false,
    		startX = 0,
        startY = 0;

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
      ctx.drawImage(img, 0, 0, exemplarImage.width, exemplarImage.height);
      canvas.onmousemove = updateLine;
      canvas.onmousedown = startSelection;
      canvas.onmouseup = endSelection;
    }

    function startSelection(e) {

      isDrawing = true;
      var r = canvas.getBoundingClientRect();
    	startX = e.clientX - r.left;
      startY = e.clientY - r.top;
    }

    function endSelection(e) {
      isDrawing = false;
      var r = canvas.getBoundingClientRect();
    	$scope.savedRectangles.push([startX, startY, e.clientX - r.left, e.clientY - r.top, "0"]);
      $scope.$apply();
      drawSavedRects();
    }

    $scope.removeField = function(index) {
      $scope.savedRectangles.splice(index, 1);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      drawSavedRects();
    }
    function drawSavedRects() {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    	for(var i in $scope.savedRectangles) {
      	var r = $scope.savedRectangles[i],
            x = Math.min(r[0],r[2]),
            y = Math.min(r[1], r[3]);
        // No of the box, box it at the top left corner
        rect(x, y, 11.5, -11.5);
        ctx.fillText((parseInt(i)+1), x+2.5, y-2.5);
        // Actual box
        rectXY(r[0], r[1], r[2], r[3]);
      }
    }

    function updateLine(e) {
      if (isDrawing) {
        // If drawing change the selection
        var r = canvas.getBoundingClientRect(),
          x = e.clientX - r.left,
          y = e.clientY - r.top;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      	drawSavedRects();
        rectXY(startX, startY, x, y);
      }
    }

    $http.get('/api/files/' + $scope.projectId + '/file/' + $scope.fileId)
    .success(function(data) {
        $scope.file = data;
        img.src = '/api/download/'+ $scope.file.identifier;
    })
    .error(function(err) {
        console.log(err);
    });

    // Form check and submit
    $scope.checkForm = function() {
      var err = [];
      // If type is not selected
      for(var i in $scope.savedRectangles) {
        if ($scope.savedRectangles[i][4] === "0") {
          err.push("Field "+(parseInt(i)+1)+" doesnt have a type");
        }
      }
      // If no schema
      if ($scope.savedRectangles.length === 0) {
        err.push("Make atleast one field for transcribing");
      }

      return err;
    }

    $scope.prepareData = function() {
      var data = [];
      for(var field in $scope.savedRectangles) {
        data.push({
          'pos': $scope.savedRectangles[field].slice(0,-1).map(function(elem){
            return elem * 500 / document.getElementById('exemplarImage').width;
          }),
          'type': $scope.savedRectangles[field][4],
          'no': field
        });
      }
      return {'schema': data};
    }

    $scope.saveSchema = function() {
      var err = $scope.checkForm();
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
        //Save the schema and redirect to the project page
        var payload = $scope.prepareData();
        console.log(payload);
        $http.put('/api/project/'+$scope.projectId, payload)
        .success(function(data){
            console.log(data);
            $location.path('/project/'+$scope.projectId);
        })
        .error(function(err){
            console.log(err);
        });
      }
    }
});
