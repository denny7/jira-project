angular.module('homeApp')
    .controller('ProjectCtrl', ['$scope', '$http', '$route', '$routeParams', '$location', 'Main', 'Project', function($scope, $http, $route, $routeParams, $location, Main, Project) {

        $scope.tasks = [];
        $scope.user = {};
        $scope.taskName = "";
        $scope.project;
        var projectId = $routeParams.projectId;
        console.log(JSON.stringify(projectId))
        Main.getLoggedUserId().then(function(res) {
            $scope.user.id = JSON.parse(res.data).userId;
        })

        Project.getTasks(projectId).then(function(res) {
            $scope.tasks = res.data[0];
            $scope.project = res.data[1][0]
            console.log('project from ctrl' + JSON.stringify($scope.project.name))
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