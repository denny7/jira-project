var app = angular.module('homeApp', ['ngRoute']);
app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider
        .when('/', {
            templateUrl: '../views/home.htm',
            controller: 'MainCtrl'
        })
        .when('/dashboard', {
            templateUrl: '../views/dash.htm',
            controller: 'DashCtrl'
        })
        .when('/login', {
            templateUrl: '../views/login.htm',
            controller: 'UserCtrl'
        })
        .when('/register', {
            templateUrl: '../views/registration.htm',
            controller: 'UserCtrl'
        })
    $locationProvider.html5Mode(true);
}]);