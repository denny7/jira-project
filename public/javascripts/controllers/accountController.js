angular.module('homeApp')
    .controller('AccountCtrl', ['$scope', '$http', '$routeParams', '$location', 'Main', 'Users', '$route', function($scope, $http, $routeParams, $location, Main, Users, $route) {
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
        Main.getLoggedUserId().then(function(res) {
            $scope.user = res.data;
            $scope.userData = {
                fullName: $scope.user.fullName,
                email: $scope.user.email
            };
            $scope.changeUserData = function() {

                var changeUserData = [];

                if ($("#fileInput")[0].files[0]) {

                    var FR = new FileReader();
                    FR.addEventListener('load', function(e) {
                        console.log('picture22')
                        $scope.userData.picture = e.target.result;
                        $scope.$apply();
                    });
                }

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
                            $scope.user = res.data;
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
        })
        $(".logoutHolder").on("mouseover", function() {
            $(".logOutText").show();
        })
        $(".logoutHolder").on("mouseleave", function() {
            $(".logOutText").hide();
        })
    }])