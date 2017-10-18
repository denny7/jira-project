angular.module('homeApp')
    .controller('MainCtrl', ['$scope', '$http', '$location', 'Main', '$routeParams', 'Project', '$rootScope', function($scope, $http, $location, Main, $routeParams, Project, $rootScope) {
        $scope.user;
        // $scope.$on('$routeChangeStart', function(newUrl, curUrl) {
        //     Main.getLoggedUserId().then(function(res) {
        //         console.log('--------------++++++++++--------');
        //         console.log(res.data)
        //         if (!res.data._id) {

        //             $location.path('/');
        //         }
        //     })
        // });
        $scope.$on('$locationChangeStart', function(event, next, current) {
            $scope.currentPath = next.split('/')[3];
        })
        $scope.getUserId = function() {
            Main.getLoggedUserId().then(function(res) {
                $scope.user = res.data;
                $rootScope.user = res.data;
                console.log(res.data)
                console.log($scope.user);
            });
            return $scope.user;
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

    }])