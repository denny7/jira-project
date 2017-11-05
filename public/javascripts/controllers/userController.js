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
            $scope.regData.tel = String($scope.regData.phone);
            var patt = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,}$/g;
            if ($scope.regData.username.length >= 4) {
                if ($scope.regData.password == $scope.regData.repeatPassword) {
                    if (patt.test($scope.regData.password)) {
                        if ($scope.regData.tel.length == 9) {
                            $scope.regData.tel = '359' + $scope.regData.phone;
                            console.log($scope.regData.phone)

                            Users.register($scope.regData).then(function(res) {
                                console.log(res)
                                if (!res.data.text) {
                                    console.log('registered')
                                    console.log($scope.regData)
                                    console.log(res.data);
                                    // $location.path('/login');
                                    $rootScope.authData = {};
                                    $('#signUp').modal('hide');
                                    $('#Authentication').modal();
                                    $rootScope.authData.username = $scope.regData.username;
                                    $rootScope.authData.password = $scope.regData.password;
                                    $rootScope.authData.email = $scope.regData.email;
                                    $rootScope.authData.phone = $scope.regData.phone;
                                    console.log(res.data)
                                    console.log($scope.authData)
                                } else {
                                    $scope.err = res.data.text;
                                    console.log($scope.err)
                                }
                            })
                        } else {
                            $scope.err = "Phone number is not correct!";
                        }
                    } else {
                        $scope.err = "Password must be at least 5 symbols, and must contain at least one number!";
                    }
                } else {

                }
            } else {
                $scope.err = "Username must be at least 4 symbols!";
            }

        }
        $scope.authSend = false;
        $scope.regAuthentication = function() {
            $scope.authSend = true;
            console.log($rootScope.authData)
            console.log($scope.authData)
            Users.authentication($scope.authData).then(function(res) {
                console.log(res)
                if (res.data.register == true) {
                    console.log('registered')
                    console.log($scope.regData)
                    console.log(res.data);
                    $scope.regData = {};
                    $('#Authentication').modal('hide');
                } else {
                    $scope.AuthenticationErr = res.data.err;
                    console.log($scope.AuthenticationErr)
                }
            })
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