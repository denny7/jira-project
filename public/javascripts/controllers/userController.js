angular.module('homeApp')
    .controller('UserCtrl', ['$scope', '$rootScope', '$location', 'Users', 'Main', '$window', function($scope, $rootScope, $location, Users, Main, $window) {
        $scope.formData = {};
        $scope.regData = {};
        $scope.userId = '';
        $scope.loginSend = false;
        $scope.logInUser = function() {
            if (!$.isEmptyObject($scope.formData)) {
                Users.logIn($scope.formData).then(function(res) {
                    $scope.loginSend = true;
                    if (!res.data.text) {
                        Main.checkForMails().then(function(res) {
                            if (res.data.forRead > 0) {
                                $rootScope.forRea = res.data.forRead;
                            } else {
                                $rootScope.forRea = 0;
                            }
                        })
                        $scope.user = res.data[0];
                        $rootScope.user = res.data[0]
                        $window.localStorage.setItem("current user", JSON.stringify($rootScope.user))
                        $location.path('/dashboard');
                        $window.sessionStorage.setItem('currentUser', 'true');
                    } else {
                        $scope.loginSend = false;
                        $scope.err = res.data.text;
                    }
                })
            }
        }
        $scope.logOut = function() {
            Users.logout().then(function(res) {
                $window.sessionStorage.removeItem('currentUser');
                $window.localStorage.removeItem('current user');
                $rootScope.user = null;
                $scope.user = null;
            })
        }
        $scope.regUser = function() {
            var patt = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,}$/g;
            if ($scope.regData.username.length >= 4) {
                if ($scope.regData.password == $scope.regData.repeatPassword) {
                    if (patt.test($scope.regData.password)) {
                        Users.register($scope.regData).then(function(res) {
                            if (res.data.register == true) {
                                $('#signUp').modal('hide');
                                $('#signIn').modal();
                            } else {
                                $scope.err = res.data.text;
                            }
                        })
                    } else {
                        $scope.err = "Password must be at least 5 symbols, and must contain at least one number!";
                    }
                } else {
                    $scope.err = "Repeated password is incorrect!";
                }
            } else {
                $scope.err = "Username must be at least 4 symbols!";
            }
        }
        $scope.forgotten = {};
        $scope.forgotPass = function() {
            Users.forgottenPass($scope.forgotten.email).then(function(res) {
                if (res.data.text) {
                    $scope.forgottenText = 'We send you a new password to this email!';
                    $('#newPassP').removeClass().addClass('text-success')
                } else {
                    $scope.forgottenText = res.data.err;
                    $('#newPassP').removeClass().addClass('text-danger')
                }
            })
        }

    }])