angular.module('homeApp')
    .controller('HomeCtrl', ['$scope', '$http', '$location', 'Main', function($scope, $http, $location, Main) {
        $('.parent').hide();
        $("footer").hide();
        $('body').addClass('homepage');
        $scope.regForgotten = function() {
            $('#forgottenPass').modal();
        }
        $scope.logModal = function() {
            $('#signIn').modal();
        };
        $scope.regModal = function() {
            $('#signUp').modal();
        }
    }])