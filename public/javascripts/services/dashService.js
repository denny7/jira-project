angular.module('homeApp')
    .factory('Dashboard', ['$http', function($http) {
        return {
            load: function(userId) {
                return $http.post('/dashboard', userId);
            }
        }
    }])