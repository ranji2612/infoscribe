var app = angular.module('signupPage', ['ngRoute']);
app.controller('signupPage', function ($scope,$http,$location) {
  $scope.validateForm = function() {
    if(!allowSubmit) {
      // Re-captcha failed
      
    }
  };
});
