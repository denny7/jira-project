angular.module('homeApp')
    .factory('Task', ['$http', function($http) {
        return {
            getTaskInfo: function(taskId) {
                return $http.get('/api/task/' + taskId);
            },
            updateTaskInfo: function(taskId, data) {
                return $http.put('/api/task/' + taskId, data);
            },
            assignToUser: function(taskId, data) {
                return $http.put('/api/task/assign/' + taskId, data);
            }
        }
    }])