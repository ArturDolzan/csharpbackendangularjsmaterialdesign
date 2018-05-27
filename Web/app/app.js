var MyApp = angular.module('myApp', ['ngMaterial', 'ngMessages', 'ngRoute', 'cl.paging']).controller('AppCtrl', AppCtrl);

function AppCtrl($scope) {
    $scope.currentNavItem = 'dashboard';
}
MyApp.config(function ($routeProvider, $locationProvider) {
    
    $locationProvider.html5Mode(true)
    $routeProvider.when('/', {
        templateUrl: '/app/dashboard/dashboard_partial.html',
        controller: 'AppCtrl'
    }).when('/dashboard', {
        templateUrl: '/app/dashboard/dashboard_partial.html',
        controller: 'AppCtrl'
    }).when('/carros', {
            templateUrl: '/app/carros/lista_carros.template.html',
            controller: 'AppCtrl'
    }).when('/importacao', {
            templateUrl: '/app/importacao/lista_importacao.template.html',
            controller: 'AppCtrl'
    });
});