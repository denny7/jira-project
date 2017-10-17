angular.module('homeApp')
    .factory('Task', ['$http', function($http) {
        return {
            getTaskInfo: function(taskId) {
                return $http.get('/api/task/' + taskId);
            }
        }
    }])