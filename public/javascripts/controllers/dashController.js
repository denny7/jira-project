angular.module('homeApp')
    .controller('DashCtrl', ['$scope', '$http', '$location', 'Main', 'Dashboard', function($scope, $http, $location, Main, Dashboard) {
        $('.parent').show();
        $('body').removeClass('homepage');

        $scope.user = {};
        Main.getLoggedUserId().then(function(res) {
            $scope.user.id = JSON.parse(res.data).userId;
            console.log('dashboard user id ' + $scope.user.id)
            Dashboard.load($scope.user).then(function(res) {
                $scope.projects = res.data;
            });
        })
        $scope.logoutUser = function() {
            Main.logoutUser().then(function(res) {
                console.log('log out')
                $location.path('/');
                $scope.user = {};
            });
        }
    }])