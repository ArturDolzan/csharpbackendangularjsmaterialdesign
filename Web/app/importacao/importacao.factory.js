MyApp.factory("importacaoFactory", function ($http) {

    var factory = {};

    factory.listarCarros = function () {
        
        return $http({
            method: 'POST',
            url: 'http://localhost:55090/api/Importacao/ListarCarros'
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
            url: 'http://localhost:55090/api/Importacao/Listar'
        });
    };

    factory.salvarImportacao = function ($scope) {
        debugger;
        return $http({
            method: 'POST',
            data: {
                'Descricao': $scope.Descricao,
                'DataImportacao': $scope.DataImportacao,
                'Id': $scope.Id,
                'Observacao': $scope.Observacao,
                'Carros': $scope.carro
            },
            url: 'http://localhost:55090/api/Importacao/Salvar'
        });
    };

    factory.editarImportacao = function(id){
        return $http({
            method: 'POST',
            data: {
                'Id': id
            },
            url: 'http://localhost:55090/api/Importacao/RecuperarPorId'
        });
    };

    factory.removerCarro = function(id){
        return $http({
            method: 'POST',
            data: {
                'Id': id
            },
            url: 'http://localhost:55090/api/Carros/Remover'
        });
    };

    factory.pesquisarCarro = function(paginacao, keywords){
        return $http({
            method: 'POST',
            data: {
                'ValorPesquisa': keywords,
                'Page': paginacao.page,
                'Start': paginacao.start,
                'Limit': paginacao.limit
            },
            url: 'http://localhost:55090/api/Carros/Pesquisar'
        });
      };
  
  // updateProduct will be here

    return factory;
});