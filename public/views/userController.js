angular.module('homeApp')
    .controller('UserCtrl', ['$scope', '$location', 'Users', function($scope, $location, Users) {
        $scope.formData = {};
        $scope.regData = {};
        $scope.userId = '';
        $scope.logInUser = function() {
            if (!$.isEmptyObject($scope.formData)) {
                Users.logIn($scope.formData).then(function(res) {
                    if (!res.data.text) {
                        console.log('loged in')
                        console.log(res.data);
                        $('#signIn').modal('hide');
                        $location.path('/dashboard');

                    } else {
                        $scope.err = res.data.text;
                    }
                })
            }
        }
        $scope.logOut = function() {
            Users.logout().then(function(res) {
                console.log(red.data.text)
            })
        }
        $scope.regUser = function() {
            if (!$.isEmptyObject($scope.regData)) {
                Users.register($scope.regData).then(function(res) {
                    if (res.data.register == true) {
                        console.log('registered')
                        console.log(res.data);
                        $location.path('/login');
                    } else {
                        $scope.err = res.data.text;
                    }
                })
            }
        }
    }])