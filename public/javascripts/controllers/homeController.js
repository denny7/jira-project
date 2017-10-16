angular.module('homeApp')
    .controller('HomeCtrl', ['$scope', '$http', '$location', 'Main', function($scope, $http, $location, Main) {
        $('.parent2').hide();
        $scope.user = {};
        $scope.getUserId = function() {
            Main.getLoggedUserId().then(function(res) {
                $scope.user.id = JSON.parse(res.data).userId;
                console.log($scope.user.id);
            });
            return $scope.user.id;
        };
        $scope.logModal = function() {
            $('#signIn').modal();
        };
        $scope.regModal = function() {
            $('#signUp').modal();
        }
    }])