angular.module('homeApp')
    .controller('NewsCtrl', ['$scope', 'News', '$location', 'Main', '$rootScope', function($scope, News, $location, Main, $rootScope) {
        $('footer').show();
        var userId = $rootScope.user._id;
        $scope.news;
        $scope.odd = 'odd';
        $scope.even = 'even';
        $scope.newsSend = true;
        var today = new Date(Date.now())
        News.getNews(userId).then(function(res) {
            $scope.news = res.data;
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
            })
            $scope.newsSend = false;
        })
    }])