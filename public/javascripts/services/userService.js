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
            },
            changePass: function(changeThisUserPassword) {
                return $http.put('/user/changePass', changeThisUserPassword);
            },
            changeData: function(changedData) {
                return $http.put('/user/changeData', changedData);
            },
            changeAvatar: function(avatarData) {
                return $http.put('/user/changeAvatar', avatarData);
            },
            forgottenPass: function(email) {
                return $http.get('/forgottenPass/' + email);
            },
            getAllUsers: function() {
                return $http.get('/allUsers');
            },
            changeUserRole: function(changedRole) {
                return $http.put('/changeUserRole', changedRole);
            },
            removeUser: function(userId) {
                return $http.delete('/removeUser/' + userId);
            },
            sendMail: function(newMail) {
                return $http.post('/sendMail', newMail);
            },
            removeMFrom: function(date) {
                return $http.post('/removeMailFromReceived', date)
            },
            removeMTo: function(date) {
                return $http.post('/removeMailFromSended', date)
            }
        }
    }])