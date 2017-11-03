    angular.module('homeApp')
        .factory('Main', ['$http', function($http) {
            return {
                getLoggedUserId: function() {
                    return $http.get('/api/logged');
                },

                logoutUser: function() {
                    return $http.get('/logout');
                },
                createPr: function(projectInfo) {
                    return $http.post('/createProject', projectInfo);
                },
                accountSettings: function() {
                    return $http.get('/api/accountSettings');
                },
                checkForMails: function() {
                    return $http.get('/checkForMails');
                }
            }
        }])