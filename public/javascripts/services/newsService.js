angular.module('homeApp')
    .factory('News', ['$http', function($http) {
        return {
            getNews: function(userId) {
                return $http.get('/api/getNews/' + userId);
            },
            getUserNews: function() {
                return $http.get('/api/getUserNews/');
            }
        }
    }])