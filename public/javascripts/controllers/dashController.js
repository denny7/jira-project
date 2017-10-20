angular.module('homeApp')
    .controller('DashCtrl', ['$scope', '$http', '$location', 'Main', 'Dashboard', function($scope, $http, $location, Main, Dashboard) {
        $('.parent').show();

        $('body').removeClass('homepage');
        $('footer').show();
        $scope.seachProject = '';
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
        $(".logoutHolder").on("mouseover", function() {
            $(".logOutText").show();
        })
        $(".logoutHolder").on("mouseleave", function() {
            $(".logOutText").hide();
        })


    }])