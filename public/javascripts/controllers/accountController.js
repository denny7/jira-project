angular.module('homeApp')
    .controller('AccountCtrl', ['$scope', '$rootScope', '$window', '$http', '$routeParams', '$location', 'Main', 'Users', '$route', "News", "$sce", function($scope, $rootScope, $window, $http, $routeParams, $location, Main, Users, $route, News, $sce) {
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
        $scope.options = {
            language: 'en',
            allowedContent: true,
            entities: false,

        };
        $scope.newMail = {};
        $scope.sentNewMail = function() {
            if ($scope.newMail.text.length > 0) {
                $scope.newMail.from = $scope.user.email;
                Users.sendMail($scope.newMail).then(function(res) {
                    if (!res.data.message) {
                        $scope.mailText = 'The mail was sended !'
                        $('#sendedMailP').removeClass().addClass('text-success');
                        $scope.newMail = {};
                    } else {
                        $scope.mailText = res.data.message;
                        $('#sendedMailP').removeClass().addClass('text-danger');
                    }
                })
            }
        }
        $scope.sortingTo = '-date';
        $scope.sortByTo = function() {
            if ($scope.sortingTo == 'to')
                $scope.sortingTo = '-to'
            else
                $scope.sortingTo = 'to'
        }
        $scope.sortBySubjectTo = function() {
            if ($scope.sortingTo == 'subject')
                $scope.sortingTo = '-subject'
            else
                $scope.sortingTo = 'subject'
        }
        $scope.sortByDateTo = function() {
            if ($scope.sortingTo == 'date')
                $scope.sortingTo = '-date'
            else
                $scope.sortingTo = 'date'
        }
        $scope.sortingFrom = '-date';
        $scope.sortByFrom = function() {
            if ($scope.sortingFrom == 'from')
                $scope.sortingFrom = '-from'
            else
                $scope.sortingFrom = 'from'
        }
        $scope.sortBySubjectFrom = function() {
            if ($scope.sortingFrom == 'subject')
                $scope.sortingFrom = '-subject'
            else
                $scope.sortingFrom = 'subject'
        }
        $scope.sortByDateFrom = function() {
            if ($scope.sortingFrom == 'date')
                $scope.sortingFrom = '-date'
            else
                $scope.sortingFrom = 'date'
        }
        $scope.removeMailFrom = function(date, index) {
            var send = {
                date: date
            }
            console.log(date, index)
            Users.removeMFrom(send).then(function(res) {
                $scope.user.receivedMails.splice(index, 1)
            })
        }
        $scope.removeMailTo = function(date, index) {
            var send = {
                date: date
            }
            Users.removeMTo(send).then(function(res) {
                $scope.user.sendedMails.splice(index, 1)
            })
        }
        $scope.seachMailFrom = '';
        $scope.seachMailTo = '';
        $scope.updateMan = function(id, role, index) {
            console.log(id + '  ' + role)
            var sendData = { userId: id, userRole: role }
            if (role == 'Admin') {
                if (confirm(`You will make this user Admin!
               Are you sure?`)) {
                    Users.changeUserRole(sendData).then(function(res) {})
                } else {
                    $scope.allUsers[index].role = 'CANCELED'
                }

            } else {
                Users.changeUserRole(sendData).then(function(res) {})
            }


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
        $scope.hideMail = function() {
            $('#mailDetails').collapse('hide');
        }
        $scope.hideAccount = function() {
            $('#accountDetails').collapse('hide');
        }
        $scope.hideSended = function() {
            $('#receivedDetails').collapse('hide');
        }
        $scope.hideReceived = function() {
            $('#sendedDetails').collapse('hide');
        }
        $scope.newMailModal = function(to, subject) {
            $('#createMail').modal();
            $scope.newMail.to = to || '';
            if (subject)
                $scope.newMail.subject = 'RE: ' + subject
            else
                $scope.newMail.subject = '';
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
            var today = new Date(Date.now())
            $scope.user.receivedMails.forEach(function(mail) {
                if (mail.subject.length > 20) {
                    mail.smallerSubject = mail.subject.slice(0, 20) + "...";
                } else {
                    mail.smallerSubject = mail.subject;
                }
                mail.text = $sce.trustAsHtml(mail.text);
                var dateCom = new Date(Number(mail.date));
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
                            mail.updateDateShow = today.getMinutes() + 60 - minuteCom + " minutes ago";
                        } else {
                            if ((today.getMinutes() - minuteCom) < 60 && differnceTime == 0) {
                                mail.updateDateShow = today.getMinutes() - minuteCom + " minutes ago";
                            } else {
                                mail.updateDateShow = hourCom + ":" + minuteCom;
                            }
                        }
                        if (differnceTimeMinutes == 0 && differnceTime == 0) {
                            mail.updateDateShow = "Just now";
                        }
                    } else {
                        mail.updateDateShow = hourCom + ":" + minuteCom;
                    }
                } else {
                    if (dayCom < 10) {
                        dayCom = "0" + dayCom;
                    }
                    mail.updateDateShow = dayCom + "." + monthCom + "." + yearCom;
                }
            })
            $scope.user.sendedMails.forEach(function(mail) {
                if (mail.subject.length > 20) {
                    mail.smallerSubject = mail.subject.slice(0, 20) + "...";
                } else {
                    mail.smallerSubject = mail.subject;
                }
                mail.text = $sce.trustAsHtml(mail.text);
                var dateCom = new Date(Number(mail.date));
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
                            mail.updateDateShow = today.getMinutes() + 60 - minuteCom + " minutes ago";
                        } else {
                            if ((today.getMinutes() - minuteCom) < 60 && differnceTime == 0) {
                                mail.updateDateShow = today.getMinutes() - minuteCom + " minutes ago";

                            } else {
                                mail.updateDateShow = hourCom + ":" + minuteCom;
                            }
                        }
                        if (differnceTimeMinutes == 0 && differnceTime == 0) {
                            mail.updateDateShow = "Just now";
                        }
                    } else {
                        mail.updateDateShow = hourCom + ":" + minuteCom;
                    }
                } else {
                    if (dayCom < 10) {
                        dayCom = "0" + dayCom;
                    }
                    mail.updateDateShow = dayCom + "." + monthCom + "." + yearCom;
                }
            })

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
        $scope.readMails = function(date, read, index, event) {
            if (!read) {
                console.log(date + '  ' + read)
                var send = { date: date, index: index }
                Users.readMail(send).then(function(res) {
                    $rootScope.forRea -= 1;
                    // event.target.className = 'Readed'
                })
            }
        }

        $(".logoutHolder").on("mouseover", function() {
            $(".logOutText").show();
        })
        $(".logoutHolder").on("mouseleave", function() {
            $(".logOutText").hide();
        })

    }])