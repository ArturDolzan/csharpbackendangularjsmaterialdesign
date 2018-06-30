MyApp.controller('importacaoController', function ($scope, $mdDialog, $mdToast, importacaoFactory) {

    $scope.isLoading = false;

    $scope.carro = null;
    $scope.carros = [];
    $scope.show_filters = false;
    $scope.arquivo = null;

    $scope.currentPage = 0;

    $scope.selectedImportacoes = [];

    $scope.compararImportacao = {
        segundaAbaBloqueada: true,
        index: 0,
        nomeColuna: '',
        codigoImportacaoPrincipal: 0
    };

    $scope.paging = {
        total: 1,
        current: 1,
        onPageChanged: loadPages,
        qtde: 5
    };

    $scope.data = {
        TipoImportacao : '0',
        Desabilitado: false
    };

    function loadPages() {
        
        $scope.currentPage = $scope.paging.current;
        if(!$scope.importacao_search_keywords){
            $scope.listarImportacao();
        }else{
            $scope.pesquisarImportacao();
        }
        
    };

    $scope.loadCarros = function() {
  
        importacaoFactory.listarCarros().then(function successCallback(response) {
            $scope.carros = response.data.Content;
        }, function errorCallback(response) {
            $scope.showToast(response.data.Message);
        });
    },

    $scope.isNovoCadastro = function(){
        return $scope.Id ? true: false;
    },

    $scope.showToast = function (message) {
        $mdToast.show(
            $mdToast.simple()
                .textContent(message)
                .hideDelay(2000)
                .position("top left")
        );
    },

    $scope.listarImportacao = function () {
        
        var paginacao = {
            page: $scope.paging.current,
            start: $scope.paging.current * $scope.paging.qtde,
            limit: $scope.paging.qtde
        };

        $scope.isLoading = true;

        importacaoFactory.listarImportacao(paginacao).then(function successCallback(response) {
            $scope.paging.total = Math.ceil(response.data.Quantidade.Quantidade / $scope.paging.qtde);
            $scope.importacoes = response.data.Content;

            $scope.isLoading = false;

        }, function errorCallback(response) {
            $scope.showToast(response.data.Message);

            $scope.isLoading = false;

        });

    },

    $scope.showNovaImportacaoForm = function (event) {
        $scope.show_filters = true;
        $scope.DataImportacao = new Date();
        $scope.Id = null;

        $scope.data = {
            TipoImportacao : '0',
            Desabilitado: false
        };

        $mdDialog.show({
            controller: DialogController,
            templateUrl: './app/importacao/cadastro_importacao.template.html',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            scope: $scope,
            preserveScope: true,
            fullscreen: true
        }).finally(function() {
            $scope.show_filters = false;
        });
    },

    $scope.salvarImportacao = function () {
        
        $scope.isLoading = true;
        var url = urlApi.url;

        if(!$scope.Id){

            if(!$scope.arquivo){
                $scope.isLoading = false;
                $scope.showToast("Selecione o arquivo para salvar...");
                return;
            }

            xhr = new XMLHttpRequest();
            formData = new FormData();

            var day = $scope.DataImportacao.getDate();
            var month=$scope.DataImportacao.getMonth();
            month=month+1;
            if((String(day)).length==1)
            day='0'+day;

            if((String(month)).length==1)
            month='0'+month;

            var dateT = day+ '/' + month + '/' + $scope.DataImportacao.getFullYear();

            formData.append('Files', $scope.arquivo, $scope.arquivo.name);
            formData.append('Descricao', $scope.Descricao);
            formData.append('DataImportacao', dateT);
            formData.append('Id', 0);
            formData.append('Observacao', $scope.Observacao);          
            formData.append('Carros', $scope.carro.Id);
            formData.append('TipoImportacao', $scope.data.TipoImportacao);

            xhr.open('POST', url + '/api/Importacao/SalvarImportacao', true);

            xhr.onerror=function(){
                alert('Erro ao processar requisição!');
            };

            xhr.onload=function(){
     
                if (xhr.status===200||xhr.status===202) {
                    $scope.isLoading = false;

                    $scope.showToast('Importacao realizada com sucesso!');
    
                    // refresh the list
                    $scope.listarImportacao();
        
                    // close dialog
                    $scope.cancel();
        
                    // remove form values
                    $scope.clearImportacaoForm();
                 
                }else{
                    $scope.isLoading = false;
                    $scope.showToast('Erro ao importar =/!');
                }

            };

            xhr.send(formData);

        }else{
            importacaoFactory.salvarImportacao($scope).then(function successCallback(response) {
          
                $scope.isLoading = false;

                $scope.showToast(response.data.Mensagem);
    
                // refresh the list
                $scope.listarImportacao();
    
                // close dialog
                $scope.cancel();
    
                // remove form values
                $scope.clearImportacaoForm();
    
            }, function errorCallback(response) {
                $scope.isLoading = false;
                $scope.showToast(response.data.Mensagem);
            });
        }
    },

    $scope.clearImportacaoForm = function () {
        $scope.Id = "";
        $scope.Descricao = "";
        $scope.DataImportacao = "";
        $scope.Observacao = "";
        $scope.data.TipoImportacao = 0;

        $scope.carros = [];
    },

    $scope.editarImportacao = function (id) {

        importacaoFactory.editarImportacao(id).then(function successCallback(response) {
            $scope.show_filters = true;

            // put the values in form
            $scope.Id = response.data.Content.Id;
            $scope.Descricao = response.data.Content.Descricao;
            $scope.DataImportacao = response.data.Content.DataImportacao;
            $scope.Observacao = response.data.Content.Observacao;
            $scope.data.TipoImportacao = response.data.Content.TipoImportacao;
            
            $scope.carros.push(response.data.Content.Carros);
            $scope.carro = response.data.Content.Carros;

            $scope.data.Desabilitado = true;

            $mdDialog.show({
                controller: DialogController,
                templateUrl: './app/importacao/cadastro_importacao.template.html',
                parent: angular.element(document.body),
                clickOutsideToClose: true,
                scope: $scope,
                preserveScope: true,
                fullscreen: true
            }).finally(function() {
                $scope.show_filters = false;
            }).then(
                function () { },

                // user clicked 'Cancel'
                function () {
                    $scope.clearImportacaoForm();
                }
            );

        }, function errorCallback(response) {
            $scope.showToast(response.data.Mensagem);
        });

    },

    $scope.removerImportacao = function (event, id) {

        $scope.Id = id;

        var confirm = $mdDialog.confirm()
            .title('Pergunta')
            .textContent('Deseja remover esta importacao?')
            .targetEvent(event)
            .ok('Sim')
            .cancel('Não');

        $mdDialog.show(confirm).then(

            function () {
                $scope.confirmaRemoverImportacao();
            },

            function () {
                // hide dialog
            }
        );
    },

    $scope.confirmaRemoverImportacao = function(){
        $scope.isLoading = true;
        importacaoFactory.removerImportacao($scope.Id).then(function successCallback(response){
            $scope.isLoading = false;
            $scope.Id = null;
            $scope.showToast(response.data.Mensagem);
      
            $scope.listarImportacao();
      
        }, function errorCallback(response){
            $scope.isLoading = false;
            $scope.showToast(response.data.Mensagem);
        });
      
      },

      $scope.pesquisarImportacao = function(){
    
            if(!$scope.importacao_search_keywords){
                $scope.listarImportacao();
                return;
            }

            var paginacao = {
                page: $scope.paging.current,
                start: $scope.paging.current * $scope.paging.qtde,
                limit: $scope.paging.qtde
            };

            $scope.isLoading = true;

            importacaoFactory.pesquisarImportacao(paginacao, $scope.importacao_search_keywords).then(function successCallback(response){
                 $scope.isLoading = false;
                 $scope.paging.total = Math.ceil(response.data.Quantidade.Quantidade / $scope.paging.qtde);
                 $scope.importacoes = response.data.Content;
            }, function errorCallback(response){
                 $scope.isLoading = false;
                 $scope.showToast(response.data.Mensagem);
            });
      },

      $scope.graficoImportacaoComparacao = function(event, id){
     
            $scope.Id = id;
            $scope.compararImportacao.nomeColuna = id;

            $scope.labels = [];
            $scope.data = [];
            $scope.resetGraficoComparacao();
            $scope.selectedImportacoes = [];
            $scope.compararImportacao.segundaAbaBloqueada = true;

            $mdDialog.show({
                controller: DialogController,
                templateUrl: './app/importacao/grafico/grafico_importacao_comparacao.template.html',
                parent: angular.element(document.body),
                clickOutsideToClose: true,
                scope: $scope,
                preserveScope: true,
                fullscreen: true
            }).then(
                function () { 
                    
                },

                // user clicked 'Cancel'
                function () {
                   
                }
            );

      },

      $scope.recuperarImportacoesComparacoes = function (){
         
            var codigoImportacao = $scope.importacoesColuna[0].CodigoImportacao;

            importacaoFactory.recuperarImportacoesComparacao(codigoImportacao).then(function successCallback(response){
                    
                $scope.itemImportacoesObj = response.data.Content;

            }, function errorCallback(response){
                    $scope.showToast(response.data.Mensagem);
            });


      },

      $scope.toggle = function (item, list) {

            var idx = list.indexOf(item);
            if (idx > -1) {
            list.splice(idx, 1);
            }
            else {
            list.push(item);
            }

            if(list.length > 0){
                $scope.compararImportacao.segundaAbaBloqueada = false;
            }else{
                $scope.compararImportacao.segundaAbaBloqueada = true;
            }
        
      },
    
      $scope.existe = function (item, list) {
        return list.indexOf(item) > -1;
      },

      $scope.selecionaTab = function(){
         var me = this,
             codigosImportacoes = me.selectedImportacoes;

            $scope.labels = [];
            $scope.data = [];
            $scope.resetGraficoComparacao();
            $scope.isLoading = true;

            importacaoFactory.recuperarGraficoComparacao(me.compararImportacao.codigoImportacaoPrincipal, 
                                                         me.compararImportacao.nomeColuna,
                                                         codigosImportacoes).then(function successCallback(response){
                
                $scope.NomeColuna = me.compararImportacao.nomeColuna;
                $scope.graficoComparacaoRenderizar(response.data.Content);

            }, function errorCallback(response){
                $scope.isLoading = false;
                $scope.showToast(response.data.Mensagem);
            });


      },

      $scope.resetGraficoComparacao = function(){
            var chart = $('#graficoComparacao').highcharts();
            if(chart){
                var seriesLength = chart.series.length;
                for(var i = seriesLength -1; i > -1; i--) {
                    chart.series[i].remove();
                }
            } 
      },

      $scope.graficoComparacaoSequencialRenderizar = function (dto){

        $scope.principal = [];
        $scope.secundaria = [];
        var tipoImportacao = 0,
            tipoImportacaoP = 0,
            tipoImportacaoS = 0;

        $.each(dto, function( index, value ) {
            
            tipoImportacao = value.TipoImportacao;

            if(value.CodigoImportacaoPrincipal == value.CodigoImportacao){
                $scope.principal.push(value.ValorLeitura);
                tipoImportacaoP = value.CodigoImportacaoPrincipal;
            }

            if(value.CodigoImportacaoSecundaria == value.CodigoImportacao){
                $scope.secundaria.push(value.ValorLeitura);
                tipoImportacaoS = value.CodigoImportacaoSecundaria;
            }

        });

        Highcharts.chart('graficoComparacao', {

            title: {
                text: $scope.NomeColuna
              },
        
            subtitle: {
                text: tipoImportacao == 0 ? "Data de leitura" : "Pontos sequenciais"
            },
        
            yAxis: {
                title: {
                    text: 'Temperatura (C)'
                }
            },

            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle'
            },
        
            plotOptions: {
                series: {
                    label: {
                        connectorAllowed: false
                    },
                    pointStart: 1
                }
            },
        
            series: [{
                name: 'Importação ' + tipoImportacaoP,
                data: $scope.principal
            }, {
                name: 'Importação ' + tipoImportacaoS,
                data: $scope.secundaria
            }],
        
            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        legend: {
                            layout: 'horizontal',
                            align: 'center',
                            verticalAlign: 'bottom'
                        }
                    }
                }]
            }
        
        });

        $scope.isLoading = false;
   
      },

      $scope.graficoComparacaoRenderizar = function (dto){

        $scope.labels = [];
        $scope.data = [];
        var tipoImportacao = 0;

        $.each(dto, function( index, value ) {
            
            tipoImportacao = value.TipoImportacao;

            if(value.TipoImportacao == 0){
                $scope.labels.push('Imp. ' +value.CodigoImportacao + ' - ' + value.DataLeitura);
            }else{
                $scope.labels.push('Imp. ' +value.CodigoImportacao + ' - ' + value.Sequencial);
            }

            $scope.data.push(value.ValorLeitura);
        });

        if(tipoImportacao == 1){
            $scope.graficoComparacaoSequencialRenderizar(dto);
            return;
        }

        Highcharts.chart('graficoComparacao', {
            chart: {
                zoomType: 'x'
            },

            exporting: {
                chartOptions: { // specific options for the exported image
                    plotOptions: {
                        series: {
                            dataLabels: {
                                enabled: true
                            }
                        }
                    }
                },
                fallbackToExportServer: false
            },

            title: {
              text: $scope.NomeColuna
            },

            subtitle: {
                text: tipoImportacao == 0 ? "Data de leitura" : "Pontos sequenciais"
            },
      
            yAxis: {
                title: {
                    text: 'Temperatura (C)'
                }
            },

            xAxis: {
              categories: $scope.labels
            },
      
            series: [{
              name: 'Temperatura (C)',
              data: $scope.data
            }]
          });

        $scope.isLoading = false;
   
      },

      $scope.deselecionaTab = function(){
         $scope.labels = [];
         $scope.data = [];
      },

      $scope.graficoImportacaoColuna = function(event, id){
        
        $scope.Id = id;
        $scope.compararImportacao.codigoImportacaoPrincipal = id;

        $mdDialog.show({
            controller: DialogController,
            templateUrl: './app/importacao/grafico/grafico_coluna_importacao.template.html',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            scope: $scope,
            preserveScope: true,
            fullscreen: true
        }).then(
            function () { 

            },

            // user clicked 'Cancel'
            function () {
         
            }
        );
      },

      $scope.graficoColunaCriar = function(){

            $scope.isLoading = true;
            importacaoFactory.recuperarGraficoColunas($scope.Id).then(function successCallback(response){
                $scope.isLoading = false;
                $scope.importacoesColuna = response.data.Content;
            }, function errorCallback(response) {
                $scope.isLoading = false;
                $scope.showToast(response.data.Mensagem);
            });

      }

      $scope.graficoImportacao = function(event, nomeColuna){

        $scope.NomeColuna = nomeColuna;

        $mdDialog.show({
            controller: DialogController,
            templateUrl: './app/importacao/grafico/grafico_importacao.template.html',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            scope: $scope,
            preserveScope: true,
            fullscreen: true
        }).then(
            function () { 
               
            },

            // user clicked 'Cancel'
            function () {
                $scope.data = [];
                $scope.labels = [];
            }
        );
      },

      $scope.graficoCriar = function(){
      
         $scope.isLoading = true;
         importacaoFactory.recuperarGrafico($scope.Id, $scope.NomeColuna).then(function successCallback(response){
             $scope.graficoRenderizar(response.data.Content);
         }, function errorCallback(response){
            $scope.isLoading = false;
                 $scope.showToast(response.data.Mensagem);
         });  
      },

      $scope.graficoRenderizar = function (dto){

        $scope.labels = [];
        $scope.data = [];
        var tipoImportacao = 0;

        $.each(dto, function( index, value ) {

            tipoImportacao = value.TipoImportacao;

            if(value.TipoImportacao == 0){
                $scope.labels.push(value.DataLeitura);
            }else{
                $scope.labels.push(value.Sequencial);
            }
            
            $scope.data.push(value.ValorLeitura);
        });

        Highcharts.chart('grafico', {
            chart: {
                zoomType: 'x'
            },

            exporting: {
                chartOptions: { // specific options for the exported image
                    plotOptions: {
                        series: {
                            dataLabels: {
                                enabled: true
                            }
                        }
                    }
                },
                fallbackToExportServer: false
            },

            title: {
              text: $scope.NomeColuna
            },

            subtitle: {
                text: tipoImportacao == 0 ? "Data de leitura" : "Pontos sequenciais"
            },
      
            yAxis: {
                title: {
                    text: 'Temperatura (C)'
                }
            },

            xAxis: {
              categories: $scope.labels
            },
      
            series: [{
              name: 'Temperatura (C)',
              data: $scope.data
            }]
          });

        $scope.isLoading = false;
        $scope.showToast('Gráfico renderizado com sucesso!');
      }

    function DialogController($scope, $mdDialog) {
        $scope.cancel = function () {
            $mdDialog.cancel();
        };
    }
    
});

MyApp.directive('chooseFile', function() {
    return {
      link: function (scope, elem, attrs) {
        var button = elem.find('button');
        var input = angular.element(elem[0].querySelector('input#fileInput'));
        button.bind('click', function() {
          input[0].click();
        });
        input.bind('change', function(e) {
          scope.$apply(function() {
            var files = e.target.files;
            if (files[0]) {
              scope.arquivo = files[0];
              scope.fileName = files[0].name;
            } else {
              scope.arquivo = null;
              scope.fileName = null;
            }
          });
        });
      }
    };
  });