var MyApp = angular.module('myApp', ['ngMaterial', 'ngMessages', 'ngRoute', 'cl.paging']).controller('AppCtrl', AppCtrl);

function AppCtrl($scope) {
    $scope.currentNavItem = 'dashboard';

    (function (ChartJsProvider) {
        ChartJsProvider.setOptions({ colors: ['#803690', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'] });
    }); 
}

MyApp.config(function ($routeProvider, $locationProvider ) {

    var nomeFront = urlApi.nomeFront;

    $locationProvider.html5Mode(true);

    $routeProvider.when("/index.html", {
        templateUrl: nomeFront + "/app/dashboard/dashboard_partial.html",
        controller: 'AppCtrl'
    }).when('/dashboard', {
        templateUrl: nomeFront + '/app/dashboard/dashboard_partial.html',
        controller: 'AppCtrl'
    }).when('/carros', {
        templateUrl: nomeFront + '/app/carros/lista_carros.template.html',
        controller: 'AppCtrl'
    }).when('/importacao', {
        templateUrl: nomeFront + '/app/importacao/lista_importacao.template.html',
        controller: 'AppCtrl'
    });
});

MyApp.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('blue')
      .accentPalette('deep-orange');
});



MyApp.config(function ($mdDateLocaleProvider) {
    $mdDateLocaleProvider.shortMonths = ['Jan', 'Fev', 'Mar', 'Abril', 'Maio', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    $mdDateLocaleProvider.Months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    $mdDateLocaleProvider.days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sabado'];
    $mdDateLocaleProvider.shortDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

    $mdDateLocaleProvider.formatDate = function (date) {
        return moment(date).format('DD/MM/YYYY');
    };
});

MyApp.config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
}]);

