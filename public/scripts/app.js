var app = angular.module('mainApp', ['ngRoute','ui.bootstrap','flow'])
.config(['flowFactoryProvider', function (flowFactoryProvider) {
  flowFactoryProvider.defaults = {
    target: '/api/upload',
    permanentErrors: [404, 500, 501],
    maxChunkRetries: 1,
    chunkRetryInterval: 5000,
    simultaneousUploads: 4,
    singleFile: true
  };
  flowFactoryProvider.on('catchAll', function (event) {
    console.log('catchAll', arguments,event);
  });
  // Can be used with different implementations of Flow.js
  // flowFactoryProvider.factory = fustyFlowFactory;
}]);


app.config(function ($routeProvider, $locationProvider) {
    $routeProvider
	.when('/', {
        templateUrl	:	'html/projectsSearch.html',
        controller	:	'projectsSearchCtrl'
	})
    .when('/create', {
        templateUrl	:	'html/createProject.html',
        controller	:	'createProjectCtrl'
	})
    .when('/project/:projectId',{
        templateUrl :   'html/project.html',
        controller  :   'singleProjectCtrl'
    })
    .when('/project/:projectId/exemplar/:fileId',{
        templateUrl :   'html/exemplar.html',
        controller  :   'exemplarCtrl'
    })
    .when('/project/:projectId/transcribe/:fileId',{
        templateUrl :   'html/transcribeFile.html',
        controller  :   'transcribeFileCtrl'
    })
    .otherwise({ redirectTo: '/' });

    // use the HTML5 History API
    $locationProvider.html5Mode(true);
});


app.controller('homeCtrl', function ($scope,$http,$location) {
    $('.datepicker').datepicker({
        startDate: '0d'
    });
    $scope.logout = function() {
        window.location.href = "/logout";
    };
});
