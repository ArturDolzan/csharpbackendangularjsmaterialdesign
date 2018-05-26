MyApp.factory("carrosFactory", function ($http) {

    var factory = {};

    factory.listarCarro = function (paginacao) {
        
        return $http({
            method: 'POST',
            data: {
                'Page': paginacao.page,
                'Start': paginacao.start,
                'Limit': paginacao.limit
            },
            url: 'http://localhost:55090/api/Carros/Listar'
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

    factory.editarCarro = function(id){
        return $http({
            method: 'POST',
            data: {
                'Id': id
            },
            url: 'http://localhost:55090/api/Carros/RecuperarPorId'
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