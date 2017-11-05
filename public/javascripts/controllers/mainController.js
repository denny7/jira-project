angular.module('homeApp')
    .controller('MainCtrl', ['$scope', '$anchorScroll', '$location', 'Main', '$routeParams', 'Project', '$rootScope', '$route', '$window', '$timeout', 'Task', '$interval', function($scope, $anchorScroll, $location, Main, $routeParams, Project, $rootScope, $route, $window, $timeout, Task, $interval) {
        $scope.user;
        $rootScope.user;
        $scope.taskName = '';
        $scope.newProject = {};
        $scope.$on('$locationChangeStart', function(event, next, current) {
            $scope.currentPath = next.split('/');
            Main.checkForMails().then(function(res) {
                if (res.data.forRead > 0) {
                    $rootScope.forRea = res.data.forRead;
                } else {
                    $rootScope.forRea = 0;
                }
            })
            if (!$window.sessionStorage.getItem('currentUser')) {
                $location.path('/')
            }
            if ($scope.currentPath[4] && $scope.currentPath[4].match("^59")) {
                $scope.projectId = $scope.currentPath[4];
            }
            if ($scope.currentPath[4] == 'task') {
                $scope.taskId = $scope.currentPath[5];
            }
            if ($scope.currentPath[5] && $scope.currentPath[5].match("^59") && $scope.currentPath[4] != "task") {
                $scope.projectId = $scope.currentPath[5]
            }
        })
        $scope.user = JSON.parse($window.localStorage.getItem("current user"));
        $rootScope.user = JSON.parse($window.localStorage.getItem("current user"));
        $scope.logoutUser = function() {
            Main.logoutUser().then(function(res) {
                $window.sessionStorage.removeItem('currentUser');
                $window.localStorage.removeItem('current user');
                $rootScope.projects = {};
                $location.path('/');
                $rootScope.user = null;
                $scope.user = null;
                $scope.forRead = 0;
                $rootScope.forRea = 0;
            });
        }
        $interval(function() {
            if ($window.sessionStorage.getItem('currentUser')) {
                Main.checkForMails().then(function(res) {
                    if (res.data.forRead > 0) {
                        $rootScope.forRea = res.data.forRead;

                    } else {
                        $rootScope.forRea = 0;
                    }
                })
            } else {
                $rootScope.forRea = 0;
            }
        }, 20000)
        $scope.getProject = function() {

            if ($scope.projectId == undefined) {
                Task.getTaskInfo($scope.taskId).then(function(task) {
                    $scope.projectId = task.data[0].projectId;
                    Project.getTasks($scope.projectId).then(function(res) {
                        $scope.projectt = res.data[1][0];
                        $rootScope.project = res.data[1][0];
                        $rootScope.tasks = res.data[0];
                        $scope.projectPath = '/project/' + res.data[1][0]._id;
                        $scope.peoplePath = '/project/people/' + res.data[1][0]._id;
                        $scope.sprintsPath = '/project/activeSprints/' + res.data[1][0]._id;
                        Project.getAllUsers($scope.projectId).then(function(res) {
                            $scope.people = res.data;
                            $rootScope.people = res.data;
                        })
                    })
                })
            } else {

                Project.getTasks($scope.projectId).then(function(res) {
                    $scope.projectt = res.data[1][0];
                    $rootScope.project = res.data[1][0];
                    $rootScope.tasks = res.data[0];
                    $scope.projectPath = '/project/' + res.data[1][0]._id;
                    $scope.peoplePath = '/project/people/' + res.data[1][0]._id;
                    $scope.sprintsPath = '/project/activeSprints/' + res.data[1][0]._id;
                    Project.getAllUsers($scope.projectId).then(function(res) {
                        $scope.people = res.data;
                        $rootScope.people = res.data;
                    })
                })
            }
        }
        $scope.toTopOfPage = function() {
            $anchorScroll('');
        }
        $scope.createPr = function() {
            $('#createProject').modal();
        }
        $scope.createTaskF = function(event) {
            if ($scope.taskName.length >= 3) {
                var projectId = event.target.id;
                var data = {
                    userId: $scope.user._id,
                    userFullName: $scope.user.fullName,
                    taskName: $scope.taskName,
                    description: "<p>Click to add description</p>"
                }
                Project.createTask(projectId, data).then(function(res) {
                    $scope.taskName = '';
                    $route.reload();
                })
            }
        }
        $scope.createNewProject = function() {
            $scope.newProject.userId = $scope.user._id;
            $scope.newProject.users = [{ userId: $scope.user._id }];
            $scope.newProject.userFullname = $scope.user.fullName;
            Main.createPr($scope.newProject).then(function(res) {
                $scope.newProject = {};
                $('#createProject').modal('hide');
                $route.reload();
            })
        }
    }])