var app = angular.module('homeApp', ['ngRoute', 'ui.bootstrap', 'ckeditor']);
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
        .when('/account', {
            templateUrl: '../views/account.htm',
            controller: 'AccountCtrl'
        })
        .when('/news', {
            templateUrl: '../views/news.htm',
            controller: 'NewsCtrl'
        })
        .when('/project/people/:projectId', {
            templateUrl: '../views/people.htm',
            controller: 'ProjectCtrl'
        })
        .when('/project/:projectId', {
            templateUrl: '../views/project.htm',
            controller: 'ProjectCtrl'
        })
        .when('/project/task/:taskId', {
            templateUrl: '../views/task.htm',
            controller: 'TaskCtrl'
        })
        .when('/project/activeSprints/:projectId', {
            templateUrl: '../views/sprints.htm',
            controller: 'ProjectCtrl'
        })
        .otherwise({
            templateUrl: '../views/dash.htm',
            controller: 'DashCtrl',
            requireAuth: true
        })
    $locationProvider.html5Mode(true);
}]);