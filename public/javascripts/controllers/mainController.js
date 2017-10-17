angular.module('homeApp')
    .controller('MainCtrl', ['$scope', '$http', '$location', 'Main', '$routeParams', 'Project', function($scope, $http, $location, Main, $routeParams, Project) {
        $scope.user = {};
        // $scope.$on('$routeChangeStart', function(newUrl, curUrl) {
        //     Main.getLoggedUserId().then(function(res) {
        //         $scope.user.id = JSON.parse(res.data).userId;
        //         if ($scope.user.id == undefined) {
        //             // User isn’t authenticated
        //             $location.path("/");
        //         }
        //     })
        // });
        $scope.$on('$locationChangeStart', function(event, next, current) {
            $scope.currentPath = next.split('/')[3];
        })
        $scope.getUserId = function() {
            Main.getLoggedUserId().then(function(res) {
                $scope.user.id = JSON.parse(res.data).userId;

                console.log($scope.user.id);
            });
            return $scope.user.id;
        };
        $scope.logOutUser = function() {
            Main.logoutUser().then(function(res) {
                $location.path('/');
                $scope.user = {};
            });
        }
        $scope.getProject = function() {
                var projectId = $routeParams.projectId;

            }
            // $scope.logModal = function() {
            //     $('#signIn').modal();
            // };
            // $scope.regModal = function() {
            //     $('#signUp').modal();
            // }
    }])