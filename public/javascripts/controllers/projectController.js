angular.module('homeApp')
    .controller('ProjectCtrl', ['$scope', '$http', '$route', '$rootScope', '$routeParams', '$location', 'Main', 'Project', '$window', function($scope, $http, $route, $rootScope, $routeParams, $location, Main, Project, $window) {
        $(".logoutHolder").on("mouseover", function() {
            $(".logOutText").show();
        })
        $(".logoutHolder").on("mouseleave", function() {
            $(".logOutText").hide();
        })
        $("footer").hide()
        console.log("+++++++++++++++++++++++++++++++++++")
        console.log($rootScope.user)
        $scope.user = $rootScope.user;
        $scope.user.id = $rootScope.user._id;
        $scope.newUser = {};
        $scope.taskName = "";
        $scope.project;
        $scope.seachTask = '';
        $scope.removeUser = function(event) {
            var userId = {};
            userId.id = event.target.id;
            Project.removeUser(projectId, userId).then(function(res) {
                console.log('ready');
                $route.reload();
            })
        }
        $scope.removeProjectFunc = function() {
            if (confirm(`WARNING !!!
                    YOU WILL DELETE THE PROJECT AND ALL ISSUES IN IT !!
                    ARE YOU SURE ?`)) {
                Project.removeProject($scope.project).then(function(res) {
                    console.log('projects removed!')
                    $location.path('/dashboard');
                })
            }

        }
        $scope.removeTask = function(event) {
            var taskId = {};
            taskId.id = event.target.id;
            console.log('task id')
            console.log(taskId.id)
            if (confirm('Are you sure that you want to delete this issue?')) {
                Project.removeTask(taskId).then(function(res) {
                    console.log('ready');
                    $route.reload();
                })
            }

        }
        var projectId = $routeParams.projectId;
        $rootScope.projectId = $routeParams.projectId
            // if (projectId != undefined) {
            //     $window.localStorage.setItem("projectId", JSON.stringify(projectId))

        // }
        // console.log(projectId)
        // Main.getLoggedUserId().then(function(res) {
        //     console.log(res.data)
        //     $scope.user = res.data;
        //     $scope.user.id = res.data._id;
        // })
        $scope.peopleFunc = function() {
            Project.getAllUsers(projectId).then(function(res) {
                console.log(res.data)
                $scope.people = res.data;
                console.log($scope.people)
            })
        }

        Project.getTasks(projectId).then(function(res) {
            $scope.tasks = res.data[0];
            $scope.project = res.data[1][0]
            $scope.peopleFunc()
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
        $scope.sorting = '';
        $scope.sortByName = function() {
            if ($scope.sorting == 'name')
                $scope.sorting = '-name'
            else
                $scope.sorting = 'name'
        }
        $scope.sortByPriority = function() {
            if ($scope.sorting == 'priorityNumber')
                $scope.sorting = '-priorityNumber'
            else
                $scope.sorting = 'priorityNumber'
        }
        $scope.sortByType = function() {
            if ($scope.sorting == 'type')
                $scope.sorting = '-type'
            else
                $scope.sorting = 'type'
        }
    }])