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

    factory.SalvarImportacaoFile = function ($scope){

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

        xhr.open('POST', 'http://localhost:55090/api/Importacao/SalvarImportacao', true);

        xhr.onerror=function(){
            alert('Erro ao processar requisição!');
        };

        xhr.onload=function(){
            if (xhr.status===200||xhr.status===202) {
                debugger;
            }else{
             
            }
        
        };

        xhr.send(formData);
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