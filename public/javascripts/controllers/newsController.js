angular.module('homeApp')
    .controller('NewsCtrl', ['$scope', 'News', '$location', 'Main', '$rootScope', function($scope, News, $location, Main, $rootScope) {
        var userId = $rootScope.user._id;
        News.getNews(userId).then(function(res) {
            console.log(res.data);
        })

    }])