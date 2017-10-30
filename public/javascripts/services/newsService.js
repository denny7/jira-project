angular.module('homeApp')
    .factory('News', ['$http', function($http) {
        return {
            getNews: function(userId) {
                return $http.get('---------------------------', userId);
            }
        }
    }])