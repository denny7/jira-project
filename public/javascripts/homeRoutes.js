var app = angular.module('homeApp', ['ngRoute']);
app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider
        .when('/', {
            templateUrl: '../views/home.htm',
            controller: 'HomeCtrl'
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
        .when('/project/:projectId', {
            templateUrl: '../views/project.htm',
            controller: 'ProjectCtrl'
        })
        .when('/project/task/:taskId', {
            templateUrl: '../views/task.htm',
            controller: 'TaskCtrl'
        })
        .otherwise({
            templateUrl: '../views/dash.htm',
            controller: 'DashCtrl',
            requireAuth: true
        })
    $locationProvider.html5Mode(true);
}]);