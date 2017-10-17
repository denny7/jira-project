angular.module('homeApp')
    .controller('MainCtrl', ['$scope', '$http', '$location', 'Main', function($scope, $http, $location, Main) {
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
            // $scope.logModal = function() {
            //     $('#signIn').modal();
            // };
            // $scope.regModal = function() {
            //     $('#signUp').modal();
            // }
    }])