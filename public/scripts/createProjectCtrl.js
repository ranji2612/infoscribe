app.controller('createProjectCtrl', function($scope,$http) {
    console.log('Create Project under control..');
    $('.datepicker').datepicker({
        startDate: '-3d'
    });
    $scope.privacy="public";
});