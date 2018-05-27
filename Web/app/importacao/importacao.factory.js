MyApp.factory("importacaoFactory", function ($http) {

    var factory = {};

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

    factory.salvarCarro = function ($scope) {
        return $http({
            method: 'POST',
            data: {
                'Descricao': $scope.Descricao,
                'Ativo': true,
                'Id': $scope.Id
            },
            url: 'http://localhost:55090/api/Carros/Salvar'
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