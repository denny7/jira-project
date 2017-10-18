angular.module('homeApp')
    .controller('TaskCtrl', ['$scope', '$http', '$routeParams', '$location', 'Main', 'Task', function($scope, $http, $routeParams, $location, Main, Task) {

        $scope.task;
        $scope.user = {};
        $scope.taskId = $routeParams.taskId;
        console.log('task id ' + JSON.stringify($scope.taskId))
        Main.getLoggedUserId().then(function(res) {
            $scope.user.id = JSON.parse(res.data).userId;
        })

        Task.getTaskInfo($scope.taskId).then(function(res) {
            $scope.task = res.data[0];
        }).catch(function(err) {
            console.log(err.status)
        })
    }])