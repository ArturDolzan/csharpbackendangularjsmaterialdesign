MyApp.controller('dashboardController', function ($scope, $mdDialog, $mdToast, dashboardFactory) {

    $scope.isLoading = false;

    $scope.graficoPizzaCriar = function(){

        $scope.isLoading = true;
        dashboardFactory.recuperarGraficoPizza().then(function successCallback(response){
            $scope.renderizaGraficoPizza(response.data.Content);
        }, function errorCallback(response){
            $scope.isLoading = false;
            $scope.showToast(response.data.Mensagem);
        });
        
    },

    $scope.renderizaGraficoPizza = function(dto){
        
        var dtoGrafico = [];

        $.each(dto, function( index, value ) {
            var dtoObj = {};

            dtoObj.name = value.DescricaoCarro;
            dtoObj.y = value.Qtde;

            dtoGrafico.push(dtoObj);
        });

        Highcharts.chart('graficoPizza', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text: 'Importacoes por Carro'
            },
            
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        style: {
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                        }
                    }
                }
            },
            series: [{
                name: 'Qtde. importacoes',
                colorByPoint: true,
                data: dtoGrafico
               
            }]
        });

        $scope.isLoading = false;
    }

});