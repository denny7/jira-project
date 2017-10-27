angular.module('homeApp')
    .controller('AccountCtrl', ['$scope', '$rootScope', '$window', '$http', '$routeParams', '$location', 'Main', 'Users', '$route', function($scope, $rootScope, $window, $http, $routeParams, $location, Main, Users, $route) {
        $scope.user;

        $scope.changePass = {};
        $scope.text = '';
        $scope.dataText = '';
        $scope.logOutUser = function() {
            Main.logoutUser().then(function(res) {
                $location.path('/');
                $scope.user = {};
            });
        }


        Main.accountSettings().then(function(res) {
            $scope.user = res.data;
            $rootScope.user = res.data;
            $window.localStorage.setItem("current user", JSON.stringify(res.data))
            $scope.userData = {
                fullName: $scope.user.fullName,
                email: $scope.user.email,
            };
            $scope.changeUserData = function() {
                var changeUserData = [];
                changeUserData.push($scope.user, $scope.userData);
                Users.changeData(changeUserData).then(function(res) {
                    $scope.dataText = 'You successfully changed your details !'
                    $route.reload();
                }).catch(function(err) {
                    $scope.dataText = err.status;
                    $route.reload();
                })
            }
            $scope.changePassword = function() {
                    var patt = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,}$/g;
                    var changeThisUserPassword = [];
                    console.log('new')
                    console.log($scope.changePass)
                    if (patt.test($scope.changePass.new)) {
                        changeThisUserPassword.push($scope.user, $scope.changePass)
                        Users.changePass(changeThisUserPassword).then(function(res) {
                            console.log(res.data)
                            if (!res.data.text) {
                                $('#changePassP').removeClass().addClass('text-success')
                                $scope.text = 'You successfully changed your password !';
                            } else {
                                $('#changePassP').removeClass().addClass('text-danger')
                                $scope.text = res.data.text;
                            }

                        })
                    } else {
                        $('#changePassP').removeClass().addClass('text-danger')
                        $scope.text = 'Your new password is invalid !';
                    }
                }
                // // base 64 image upload
            $('input[type=file]').change(function() {
                var file = this.files[0]
                base64img = '';

                function getBase64(file) {
                    if (file.size < 1048576) {
                        var reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.onload = function() {
                            var base64img = reader.result;
                            var avatarData = {
                                userId: $scope.user._id,
                                avatar: base64img
                            }
                            Users.changeAvatar(avatarData).then(function() {
                                $route.reload();
                            });
                        };
                        reader.onerror = function(error) {
                            console.log('Error: ', error);
                        };
                    } else {
                        $('#changeAvatarP').text("Too large photo! Photo must be up to 1MB!");
                    }
                }
                getBase64(file)
            })
        })

        $(".logoutHolder").on("mouseover", function() {
            $(".logOutText").show();
        })
        $(".logoutHolder").on("mouseleave", function() {
            $(".logOutText").hide();
        })
    }])