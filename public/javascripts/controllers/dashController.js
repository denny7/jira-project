angular.module('homeApp')
    .controller('DashCtrl', ['$scope', '$rootScope', '$http', '$location', 'Main', 'Dashboard', "$timeout", '$route', function($scope, $rootScope, $http, $location, Main, Dashboard, $timeout, $route) {
        $('.parent').show();

        $rootScope.projects = [];
        console.log($rootScope.projects)
        $scope.projects = [];
        $('body').removeClass('homepage');
        $('footer').show();
        $scope.seachProject = '';
        $scope.dashSend = true;
        // Main.getLoggedUserId().then(function(res) {
        // console.log('dashboard')
        // console.log(res.data)
        $scope.user = $rootScope.user;
        // $rootScope.user = res.data
        // console.log('dashboard user id ' + $scope.user._id)
        console.log($rootScope.user)
        Dashboard.load($scope.user).then(function(res) {
            $scope.dashSend = false;
            console.log('scope user id ')
            console.log($rootScope.user)
            $rootScope.projects = res.data;
            $scope.projects = $rootScope.projects;
        });
        // })
        $(".logoutHolder").on("mouseover", function() {
            $(".logOutText").show();
        })
        $(".logoutHolder").on("mouseleave", function() {
            $(".logOutText").hide();
        })
        $timeout(function() { console.log($rootScope.user) })
        console.log("--------------------------")
        console.log($rootScope)
        console.log($rootScope.user)
    }])