angular.module('homeApp')
    .controller('ProjectCtrl', ['$scope', '$http', '$route', '$routeParams', '$location', 'Main', 'Project', function($scope, $http, $route, $routeParams, $location, Main, Project) {

        $scope.tasks = [];
        $scope.user = {};
        $scope.newUser = {};
        $scope.taskName = "";
        $scope.project;
        $scope.removeUser = function(event) {
            var userId = {};
            userId.id = event.target.id;
            Project.removeUser(projectId, userId).then(function(res) {
                console.log('ready');
                $route.reload();

            })

        }
        var projectId = $routeParams.projectId;
        console.log(projectId)
        Main.getLoggedUserId().then(function(res) {
            console.log(res.data)
            $scope.user.id = res.data._id;
        })

        Project.getAllUsers(projectId).then(function(res) {
            console.log(res.data)
            $scope.people = res.data;
            console.log($scope.people)
        })

        Project.getTasks(projectId).then(function(res) {
            $scope.tasks = res.data[0];
            $scope.project = res.data[1][0]
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
        $scope.addPeople = function() {
            $('#addPeople').modal();
        }
        $scope.addNewUserF = function() {
            Project.addUser($scope.project._id, $scope.newUser).then(function(res) {
                console.log($scope.newUser)
                if (!res.data.text) {
                    $scope.user = res.data;
                    $('#addUserT').removeClass().addClass('text-success')
                    $scope.addUserText = 'You successfully add this user!';

                } else {
                    $('#addUserT').removeClass().addClass('text-danger')
                    $scope.addUserText = res.data.text;
                }
            })
        }
    }])