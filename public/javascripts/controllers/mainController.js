angular.module('homeApp')
    .controller('MainCtrl', ['$scope', '$http', '$location', 'Main', '$routeParams', 'Project', '$rootScope', '$route', '$window', function($scope, $http, $location, Main, $routeParams, Project, $rootScope, $route, $window) {
        $scope.user;
        $rootScope.user;
        $scope.newProject = {};
        $scope.$on('$locationChangeStart', function(event, next, current) {
            $scope.currentPath = next.split('/');
            console.log('from location change start')

            if ($scope.currentPath[4] && $scope.currentPath[4].match("^59")) {
                $scope.projectId = $scope.currentPath[4];
            }


            if ($scope.currentPath[5] && $scope.currentPath[5].match("^59")) {
                $scope.projectId = $scope.currentPath[5]
            }
        })
        if (!$scope.user) {
            $scope.user = JSON.parse($window.localStorage.getItem("current user"))
            $rootScope.user = JSON.parse($window.localStorage.getItem("current user"))
        }
        $scope.logoutUser = function() {
            Main.logoutUser().then(function(res) {
                console.log('log out')
                $location.path('/');
                $scope.user = {};
            });
        }

        // Main.getLoggedUserId().then(function(res) {
        //     $scope.user = res.data;
        //     $rootScope.user = res.data;
        //     console.log(res.data)
        //     console.log($scope.user);
        // });


        // $scope.logOutUser = function() {
        //     Main.logoutUser().then(function(res) {
        //         $location.path('/');
        //         $scope.user = {};
        //     });
        // }
        $scope.getProject = function() {
            // $route.reload();
            console.log('from main')
            console.log($scope.projectId)
            if ($scope.projectId != JSON.stringify($window.localStorage.getItem("projectId")) && $window.localStorage.getItem("projectId") != "undefined") {
                $scope.projectId = JSON.stringify($window.localStorage.getItem("projectId"))
            }
            Project.getTasks($scope.projectId).then(function(res) {
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
        $scope.createPr = function() {
            $('#createProject').modal();
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