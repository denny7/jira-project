angular.module('homeApp')
    .factory('Project', ['$http', function($http) {
        return {
            getTasks: function(projectId) {
                return $http.get('/api/project/' + projectId);
            },
            createTask: function(projectId, data) {
                return $http.post('/api/project/' + projectId, data);
            }
        }
    }])