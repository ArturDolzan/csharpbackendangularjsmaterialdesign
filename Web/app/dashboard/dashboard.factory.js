MyApp.factory("dashboardFactory", function ($http) {

    var factory = {},
        url = urlApi.url;
   
    factory.recuperarGraficoPizza = function(){
        return $http({
            method: 'POST',
            data: {
            },
            url: url +'/api/Importacao/RecuperarGraficoPizza'
        });
        };

    return factory;
});