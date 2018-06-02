MyApp.factory("carrosFactory", function ($http) {

    var factory = {},
        url = urlApi.url;
   
    factory.listarCarro = function (paginacao) {
        
        return $http({
            method: 'POST',
            data: {
                'Page': paginacao.page,
                'Start': paginacao.start,
                'Limit': paginacao.limit
            },
            url: url+'/api/Carros/Listar'
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
            url: url +'/api/Carros/Salvar'
        });
    };

    factory.editarCarro = function(id){
        return $http({
            method: 'POST',
            data: {
                'Id': id
            },
            url: url +'/api/Carros/RecuperarPorId'
        });
    };

    factory.removerCarro = function(id){
        return $http({
            method: 'POST',
            data: {
                'Id': id
            },
            url: url +'/api/Carros/Remover'
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
            url: url +'/api/Carros/Pesquisar'
        });
      };
  
  // updateProduct will be here

    return factory;
});