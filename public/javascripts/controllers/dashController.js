angular.module('homeApp')
    .controller('DashCtrl', ['$scope', '$rootScope', '$http', '$location', 'Main', 'Dashboard', "$timeout", '$route', function($scope, $rootScope, $http, $location, Main, Dashboard, $timeout, $route) {
        //Events
        $('.parent').show();
        $(".addPrBtn").hide()
        $('body').removeClass('homepage');
        $('footer').show();
        $(".logoutHolder").on("mouseover", function() {
            $(".logOutText").show();
        })
        $(".logoutHolder").on("mouseleave", function() {
            $(".logOutText").hide();
        })

        $rootScope.projects = [];
        $scope.projects = [];
        $scope.seachProject = '';
        $scope.dashSend = true;
        $scope.user = $rootScope.user;
        if ($scope.user.role == "Admin") {
            $(".addPrBtn").show()
        }
        Dashboard.load($scope.user).then(function(res) {
            $scope.dashSend = false;

            $rootScope.projects = res.data;
            $scope.projects = $rootScope.projects;
        });
    }])