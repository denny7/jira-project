angular.module('homeApp')
<<<<<<< HEAD
    .controller('UserCtrl', ['$scope', '$rootScope', '$location', 'Users', 'Main', '$window', function($scope, $rootScope, $location, Users, Main, $window) {
=======
    .controller('UserCtrl', ['$scope', '$location', 'Users', '$window', function($scope, $location, Users, $window) {
>>>>>>> 60c7fbd8ff18f5b64dbe1c16734c953612b26e5b
        $scope.formData = {};
        $scope.regData = {};
        $scope.userId = '';
        $scope.logInUser = function() {
            if (!$.isEmptyObject($scope.formData)) {
                Users.logIn($scope.formData).then(function(res) {
                    console.log(res.data)
                    if (!res.data.text) {
                        console.log('loged in')
                        console.log(res.data);
<<<<<<< HEAD
                        Main.getLoggedUserId().then(function(res) {
                            console.log('dashboard')
                            console.log(res.data)
                            $scope.user = res.data;
                            $rootScope.user = res.data
                            console.log('dashboard user id ' + $scope.user._id)
                            $window.localStorage.setItem("current user", JSON.stringify($rootScope.user))
                            $location.path('/dashboard');
                        })

=======
                        $location.path('/dashboard');
                        $window.sessionStorage.setItem('currentUser', 'true');
>>>>>>> 60c7fbd8ff18f5b64dbe1c16734c953612b26e5b
                    } else {
                        $scope.err = res.data.text;
                    }
                })
            }
        }
        $scope.logOut = function() {
            Users.logout().then(function(res) {
                console.log(red.data.text)
                $window.sessionStorage.removeItem('currentUser');
            })
        }
        $scope.regUser = function() {
            var patt = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,}$/g;
            if ($scope.regData.username.length >= 4) {
                if ($scope.regData.password == $scope.regData.repeatPassword) {
                    if (patt.test($scope.regData.password)) {
                        Users.register($scope.regData).then(function(res) {
                            if (res.data.register == true) {
                                console.log('registered')
                                console.log($scope.regData)
                                console.log(res.data);
                                // $location.path('/login');
                                $('#signUp').modal('hide');
                                $('#signIn').modal();
                            } else {
                                $scope.err = res.data.text;
                                console.log($scope.err)
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

    }])