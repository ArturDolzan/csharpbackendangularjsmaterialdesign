MyApp.factory("importacaoFactory", function ($http) {

    var factory = {},
        url = urlApi.url;

    factory.listarCarros = function () {
        
        return $http({
            method: 'POST',
            url: url +'/api/Importacao/ListarCarros'
        });
    };

    factory.listarImportacao = function (paginacao) {
        
        return $http({
            method: 'POST',
            data: {
                'Page': paginacao.page,
                'Start': paginacao.start,
                'Limit': paginacao.limit
            },
            url: url +'/api/Importacao/Listar'
        });
    };

    factory.salvarImportacao = function ($scope) {

        return $http({
            method: 'POST',
            data: {
                'Descricao': $scope.Descricao,
                'DataImportacao': $scope.DataImportacao,
                'Id': $scope.Id,
                'Observacao': $scope.Observacao,
                'TipoImportacao': $scope.data.TipoImportacao,
                'Carros': $scope.carro
            },
            url: url +'/api/Importacao/Salvar'
        });
    };

    factory.editarImportacao = function(id){
        return $http({
            method: 'POST',
            data: {
                'Id': id
            },
            url: url +'/api/Importacao/RecuperarPorId'
        });
    };

    factory.removerImportacao = function(id){
        return $http({
            method: 'POST',
            data: {
                'Id': id
            },
            url: url +'/api/Importacao/Remover'
        });
    };

    factory.pesquisarImportacao = function(paginacao, keywords){
        return $http({
            method: 'POST',
            data: {
                'ValorPesquisa': keywords,
                'Page': paginacao.page,
                'Start': paginacao.start,
                'Limit': paginacao.limit
            },
            url: url +'/api/Importacao/Pesquisar'
        });
      };

      factory.recuperarGraficoComparacao = function(codigoImportacaoPrincipal, nomeColuna, codigosImportacoes){
        return $http({
            method: 'POST',
            data: {
                'CodigoImportacaoPrincipal': codigoImportacaoPrincipal,
                'CodigoImportacao': codigosImportacoes,
                'NomeColuna':nomeColuna
            },
            url: url +'/api/Importacao/RecuperarGraficoComparacao'
        });
      };

      factory.recuperarGrafico = function(codigoImportacao, nomeColuna){
        return $http({
            method: 'POST',
            data: {
                'CodigoImportacao': codigoImportacao,
                'NomeColuna':nomeColuna
            },
            url: url +'/api/Importacao/RecuperarGrafico'
        });
      };

      factory.recuperarImportacoesComparacao = function(codigoImportacao){
        return $http({
            method: 'POST',
            data: {
                'Id': codigoImportacao
            },
            url: url +'/api/Importacao/RecuperarImportacoesComparacao'
        });
      };

      factory.recuperarGraficoColunas = function(codigoImportacao){
        return $http({
            method: 'POST',
            data: {
                'CodigoImportacao': codigoImportacao
            },
            url: url +'/api/Importacao/RecuperarNomeColunas'
        });
      };

    return factory;
});