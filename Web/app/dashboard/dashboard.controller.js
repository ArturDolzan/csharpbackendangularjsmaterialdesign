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
                text: 'Importações por Carro'
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
                name: 'Qtde. importações',
                colorByPoint: true,
                data: dtoGrafico
               
            }]
        });

        $scope.isLoading = false;
    },

    $scope.graficoBarraCriar = function(){

        $scope.isLoading = true;
        dashboardFactory.recuperarGraficoBarra().then(function successCallback(response){
            $scope.renderizaGraficoBarra(response.data.Content);
        }, function errorCallback(response){
            $scope.isLoading = false;
            $scope.showToast(response.data.Mensagem);
        });
        
    },

    $scope.renderizaGraficoBarra = function(dto){
        
        var dtoX = [],
            dtoMax = [],
            dtoMin = [];
         
        $.each(dto, function( index, value ) {
            dtoX.push(value.NomeColuna);
            dtoMax.push(value.MaxValorLeitura);
            dtoMin.push(value.MinValorLeitura);
        });

        Highcharts.chart('graficoBarra', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Temperaturas Máxima e Mínima'
            },
            subtitle: {
                text: 'Medidos na última importação'
            },
            xAxis: {
                categories: dtoX,
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Temperatura (c)'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:.1f} c</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            series: [{
                name: 'Máxima',
                data: dtoMax
        
            }, {
                name: 'Mínima',
                data: dtoMin
        
            }]
        });

        $scope.isLoading = false;
    }

});