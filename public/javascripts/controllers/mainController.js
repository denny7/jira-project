angular.module('homeApp')
    .controller('MainCtrl', ['$scope', '$anchorScroll', '$location', 'Main', '$routeParams', 'Project', '$rootScope', '$route', '$window', '$timeout', 'Task', '$interval', function($scope, $anchorScroll, $location, Main, $routeParams, Project, $rootScope, $route, $window, $timeout, Task, $interval) {
        $scope.user;
        $rootScope.user;
        $scope.taskName = '';
        // $scope.$on('$routeChangeStart', function(newUrl, curUrl) {
        //     Main.getLoggedUserId().then(function(res) {
        //         console.log('--------------++++++++++--------');
        //         console.log(res.data)
        //         if (!res.data._id) {

        //             $location.path('/');
        //         }
        //     })
        // });

        $scope.newProject = {};
        $scope.$on('$locationChangeStart', function(event, next, current) {
                $scope.currentPath = next.split('/');
                Main.checkForMails().then(function(res) {
                    if (res.data.forRead > 0) {
                        console.log('new message')
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
            // if (!$scope.user) {
        $scope.user = JSON.parse($window.localStorage.getItem("current user"));
        $rootScope.user = JSON.parse($window.localStorage.getItem("current user"));
        // }
        $scope.logoutUser = function() {
            Main.logoutUser().then(function(res) {
                console.log('log out')
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
                console.log('interval')
                Main.checkForMails().then(function(res) {
                    if (res.data.forRead > 0) {
                        console.log('new message')
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
            // $route.reload();
            console.log('from main')
            console.log($scope.projectId)
            if ($scope.projectId == undefined) {
                console.log('vutre sme')
                Task.getTaskInfo($scope.taskId).then(function(task) {
                    $scope.projectId = task.data[0].projectId;
                    console.log($scope.projectId)
                    Project.getTasks($scope.projectId).then(function(res) {
                        console.log("resss data")
                        console.log(res.data)
                        $scope.projectt = res.data[1][0];
                        $rootScope.project = res.data[1][0];
                        $rootScope.tasks = res.data[0];
                        console.log($rootScope.tasks);
                        $scope.projectPath = '/project/' + res.data[1][0]._id;
                        $scope.peoplePath = '/project/people/' + res.data[1][0]._id;
                        $scope.sprintsPath = '/project/activeSprints/' + res.data[1][0]._id;
                        Project.getAllUsers($scope.projectId).then(function(res) {
                            console.log(res.data)
                            $scope.people = res.data;
                            $rootScope.people = res.data;
                            console.log($scope.people)
                                // $route.reload();

                        })
                    })
                })
            } else {

                Project.getTasks($scope.projectId).then(function(res) {
                    console.log("resss data")
                    console.log(res.data)
                    $scope.projectt = res.data[1][0];
                    $rootScope.project = res.data[1][0];
                    $rootScope.tasks = res.data[0];
                    console.log($rootScope.tasks);
                    $scope.projectPath = '/project/' + res.data[1][0]._id;
                    $scope.peoplePath = '/project/people/' + res.data[1][0]._id;
                    $scope.sprintsPath = '/project/activeSprints/' + res.data[1][0]._id;
                    Project.getAllUsers($scope.projectId).then(function(res) {
                        console.log(res.data)
                        $scope.people = res.data;
                        $rootScope.people = res.data;
                        console.log($scope.people)
                            // $route.reload();

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
            var projectId = event.target.id;
            var data = {
                userId: $scope.user._id,
                userFullName: $scope.user.fullName,
                taskName: $scope.taskName
            }

            console.log($scope.taskName)
            Project.createTask(projectId, data).then(function(res) {
                // $scope.tasks.push(res.data);
                // console.log(res.data)
                $scope.taskName = '';
                $route.reload();
            })
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