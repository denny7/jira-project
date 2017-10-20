angular.module('homeApp')
    .factory('Project', ['$http', function($http) {
        return {
            getTasks: function(projectId) {
                return $http.get('/api/project/' + projectId);
            },
            createTask: function(projectId, data) {
                return $http.post('/api/project/' + projectId, data);
            },
            getAllUsers: function(projectId) {
                return $http.get('/api/project/people/' + projectId);
            },
            addUser: function(projectId, data) {
                return $http.put('/api/project/addUser/' + projectId, data);
            },
            removeUser: function(projectId, userId) {
                return $http.put('/api/project/removeUser/' + projectId, userId)
            },
            removeTask: function(taskId) {
                return $http.put('/api/project/removeTask', taskId)
            },
            removeProject: function(projectId) {
                return $http.put('/api/project/removeProject', projectId)
            }
        }
    }])