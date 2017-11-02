angular.module('homeApp')
    .controller('AccountCtrl', ['$scope', '$rootScope', '$window', '$http', '$routeParams', '$location', 'Main', 'Users', '$route', "News", function($scope, $rootScope, $window, $http, $routeParams, $location, Main, Users, $route, News) {
        $scope.user;
        $('footer').show();
        $scope.changePass = {};
        $scope.text = '';
        $scope.dataText = '';
        $scope.news;
        $scope.newsSend = true;
        $scope.logOutUser = function() {
            Main.logoutUser().then(function(res) {
                $location.path('/');
                $scope.user = {};
            });
        }
        $scope.allUsers;
        $scope.updateMan = function(id, role) {
            console.log(id + '  ' + role)
            var sendData = { userId: id, userRole: role }
            Users.changeUserRole(sendData).then(function(res) {})
        }
        $scope.removeUser = function(id, index) {
            console.log(index)

            Users.removeUser(id).then(function(res) {
                $scope.allUsers.splice(index, 1)
            })
        }
        Users.getAllUsers().then(function(res) {
            $scope.allUsers = res.data;
        })
        $scope.news = [];
        News.getUserNews().then(function(res) {
            $scope.news = res.data;
            console.log("Nqma")

            if ($scope.news.length == 0) {
                $scope.newsSend = false;
            }
            var today = new Date()
            $scope.news.forEach(function(newChange) {
                var dateCom = new Date(Number(newChange.updateDate));
                var minuteCom = dateCom.getMinutes();
                var hourCom = dateCom.getHours();
                var dayCom = dateCom.getDate();
                var monthCom = dateCom.getMonth() + 1;
                var yearCom = dateCom.getFullYear().toString().substring(2, 4)
                if (dayCom == today.getDate() && today.getMonth() + 1 == monthCom) {
                    if (minuteCom < 10) {
                        minuteCom = "0" + minuteCom;
                    }
                    var differnceTime = today.getHours() - hourCom;
                    var differnceTimeMinutes = today.getMinutes() - minuteCom;
                    if (differnceTime < 2) {
                        if ((today.getMinutes() + 60 - minuteCom) < 60 && differnceTime == 1) {
                            newChange.updateDateShow = today.getMinutes() + 60 - minuteCom + " minutes ago";

                        } else {
                            if ((today.getMinutes() - minuteCom) < 60 && differnceTime == 0) {
                                newChange.updateDateShow = today.getMinutes() - minuteCom + " minutes ago";

                            } else {
                                newChange.updateDateShow = hourCom + ":" + minuteCom;
                            }
                        }

                        if (differnceTimeMinutes == 0 && differnceTime == 0) {
                            newChange.updateDateShow = "Just now";
                        }
                    } else {
                        newChange.updateDateShow = hourCom + ":" + minuteCom;
                    }
                } else {
                    if (dayCom < 10) {
                        dayCom = "0" + dayCom;
                    }
                    newChange.updateDateShow = dayCom + "." + monthCom + "." + yearCom;
                }
                $scope.newsSend = false;
            })

        })
        $scope.hidePeople = function() {
            $('#peoples').collapse('hide');
        }
        $scope.hideChanges = function() {
            $('#lastChanges').collapse('hide');

        }
        $scope.sorting = '';
        $scope.seachUser = '';
        $scope.sortByName = function() {
            if ($scope.sorting == 'fullName')
                $scope.sorting = '-fullName'
            else
                $scope.sorting = 'fullName'
        }
        $scope.sortByEmail = function() {
            if ($scope.sorting == 'email')
                $scope.sorting = '-email'
            else
                $scope.sorting = 'email'
        }
        $scope.sortByRole = function() {
            if ($scope.sorting == 'role')
                $scope.sorting = '-role'
            else
                $scope.sorting = 'role'
        }
        Main.accountSettings().then(function(res) {
            $scope.user = res.data;

            $rootScope.user = res.data;
            $window.localStorage.setItem("current user", JSON.stringify(res.data))
            $scope.userData = {
                fullName: String($scope.user.fullName),
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