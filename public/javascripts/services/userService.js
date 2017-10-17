angular.module('homeApp')
    .factory('Users', ['$http', function($http) {
        return {
            logIn: function(userData) {
                return $http.post('/login', userData);
            },
            logout: function() {
                return $http.get('/logout');
            },
            register: function(userData) {
                return $http.post('/register', userData);

            }
        }
    }])