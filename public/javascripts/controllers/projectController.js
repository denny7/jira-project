angular.module('homeApp')
    .controller('ProjectCtrl', ['$scope', '$http', '$route', '$routeParams', '$location', 'Main', 'Project', function($scope, $http, $route, $routeParams, $location, Main, Project) {
        $scope.tasks = [];
        $scope.user = {};
        $scope.taskName = "";
        var projectId = $routeParams.projectId;
        console.log(JSON.stringify(projectId))
        Main.getLoggedUserId().then(function(res) {
            $scope.user.id = JSON.parse(res.data).userId;
        })

        Project.getTasks(projectId).then(function(res) {
            $scope.tasks = res.data;
        })
        $scope.createTaskF = function() {
            var data = {
                userId: $scope.user.id,
                taskName: $scope.taskName
            }
            Project.createTask(projectId, data).then(function(res) {
                $scope.tasks.push(res.data);
                console.log(res.data)
                $route.reload();
            })

        }
    }])