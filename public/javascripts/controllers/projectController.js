angular.module('homeApp')
    .controller('ProjectCtrl', ['$scope', '$http', '$routeParams', '$location', 'Main', 'Project', function($scope, $http, $routeParams, $location, Main, Project) {
        $scope.tasks = [];
        $scope.user = {};
        var projectId = $routeParams.projectId;
        console.log(JSON.stringify(projectId))
        Main.getLoggedUserId().then(function(res) {
            $scope.user.id = JSON.parse(res.data).userId;
        })

        Project.getTasks(projectId).then(function(res) {
            $scope.tasks = res.data;
        })

    }])