angular.module('homeApp')
    .controller('DashCtrl', ['$scope', '$http', '$location', 'Main', 'Dashboard', function($scope, $http, $location, Main, Dashboard) {
        $('.parent').show();

        $('body').removeClass('homepage');

        $scope.user = {};
        Main.getLoggedUserId().then(function(res) {
            console.log('dashboard')
            console.log(res.data)
            $scope.user = res.data;
            console.log('dashboard user id ' + $scope.user._id)
            Dashboard.load($scope.user).then(function(res) {
                console.log('scope user id ')
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