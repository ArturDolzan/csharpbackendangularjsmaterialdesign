app.factory("carrosFactory", function ($http) {

    var factory = {};

    // read all carros
    factory.readCarros = function () {
        return $http({
            method: 'POST',
            url: 'http://localhost:55090/api/Carros/Listar'
        });
    };

    factory.createCarro = function ($scope) {
        return $http({
            method: 'POST',
            data: {
                'Descricao': $scope.Descricao,
                'Ativo': true
            },
            url: 'http://localhost:55090/api/Carros/Salvar'
        });
    };

    factory.visualizar = function(id){
        return $http({
        method: 'POST',
        data: {
            'Id': id
        },
        url: 'http://localhost:55090/api/Carros/RecuperarPorId'
        });
    };
  
  // updateProduct will be here

    return factory;
});