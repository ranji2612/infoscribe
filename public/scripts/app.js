var app = angular.module('mainApp', ['ngRoute','ui.bootstrap']);
  

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
    .otherwise({ redirectTo: '/' });
	
    // use the HTML5 History API
    $locationProvider.html5Mode(true);
});


app.controller('homeCtrl', function ($scope,$http,$location) {
	console.log('Home control is under control :P ');
    
    $scope.logout = function() {
        window.location.href = "/logout";
    };
});