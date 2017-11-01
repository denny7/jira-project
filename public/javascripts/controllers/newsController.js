angular.module('homeApp')
    .controller('NewsCtrl', ['$scope', '$http', '$location', 'Main', function($scope, $http, $location, Main) {
        $('footer').show();
    }])