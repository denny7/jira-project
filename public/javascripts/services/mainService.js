    angular.module('homeApp')
        .factory('Main', ['$http', function($http) {
            return {
                getLoggedUserId: function() {
                    return $http.get('/api/logged');
                },

                logoutUser: function() {
                    return $http.get('/logout');
                }
            }
        }])