angular.module('homeApp')
    .controller('DashCtrl', ['$scope', '$rootScope', '$http', '$location', 'Main', 'Dashboard', "$timeout", function($scope, $rootScope, $http, $location, Main, Dashboard, $timeout) {
        $('.parent').show();

        $('body').removeClass('homepage');
        $('footer').show();
        $scope.seachProject = '';
        // Main.getLoggedUserId().then(function(res) {
        // console.log('dashboard')
        // console.log(res.data)
        $scope.user = $rootScope.user
            // $rootScope.user = res.data
            // console.log('dashboard user id ' + $scope.user._id)
        Dashboard.load($scope.user).then(function(res) {
            console.log('scope user id ')
            console.log($rootScope.user)
            $scope.projects = res.data;

        });
        // })
        $(".logoutHolder").on("mouseover", function() {
            $(".logOutText").show();
        })
        $(".logoutHolder").on("mouseleave", function() {
            $(".logOutText").hide();
        })
        $timeout(function() { console.log($rootScope.user) })
        console.log($scope.$root.user)
        console.log("--------------------------")
        console.log($rootScope)
        console.log($rootScope.user)
    }])