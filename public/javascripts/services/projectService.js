angular.module('homeApp')
    .factory('Project', ['$http', function($http) {
        return {
            getTasks: function(projectId) {
                return $http.get('/api/project/' + projectId);
            }


        }
    }])