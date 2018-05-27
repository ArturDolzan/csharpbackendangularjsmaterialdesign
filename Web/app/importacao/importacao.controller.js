MyApp.controller('importacaoController', function ($scope, $mdDialog, $mdToast, importacaoFactory) {

    $scope.carro = null;
    $scope.carros = [];
    $scope.show_filters = false;

    $scope.loadCarros = function() {
  
        importacaoFactory.listarCarros().then(function successCallback(response) {
            $scope.carros = response.data.Content;
        }, function errorCallback(response) {
            $scope.showToast(response.data.Message);
        });
    };

    $scope.currentPage = 0;

    $scope.paging = {
        total: 1,
        current: 1,
        onPageChanged: loadPages,
        qtde: 5
    };

    function loadPages() {
        
        $scope.currentPage = $scope.paging.current;
        if(!$scope.carro_search_keywords){
            $scope.listarImportacao();
        }else{
            $scope.pesquisarImportacao();
        }
        
    };

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
        
        importacaoFactory.listarImportacao(paginacao).then(function successCallback(response) {
            $scope.paging.total = Math.trunc(response.data.Quantidade.Quantidade / $scope.paging.qtde) + 1;
            $scope.importacoes = response.data.Content;
        }, function errorCallback(response) {
            $scope.showToast(response.data.Message);
        });

    },

    $scope.showNovaImportacaoForm = function (event) {
        $scope.show_filters = true;

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

        carrosFactory.salvarCarro($scope).then(function successCallback(response) {
          
            $scope.showToast(response.data.Mensagem);

            // refresh the list
            $scope.listarCarro();

            // close dialog
            $scope.cancel();

            // remove form values
            $scope.clearCarrosForm();

        }, function errorCallback(response) {
            $scope.showToast(response.data.Mensagem);
        });
    },

    $scope.clearImportacaoForm = function () {
        $scope.Id = "";
        $scope.Descricao = "";
        $scope.DataImportacao = "";
        $scope.Observacao = "";

        $scope.carros = [];
       // $scope.carro = "";
       // $scope.Carros.Descricao = "";
    },

    $scope.editarImportacao = function (id) {

        importacaoFactory.editarImportacao(id).then(function successCallback(response) {
            $scope.show_filters = true;

            // put the values in form
            $scope.Id = response.data.Content.Id;
            $scope.Descricao = response.data.Content.Descricao;
            $scope.DataImportacao = response.data.Content.DataImportacao;
            $scope.Observacao = response.data.Content.Observacao;
            
            $scope.carros.push(response.data.Content.Carros);
            $scope.carro = response.data.Content.Carros;

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

    $scope.removerCarro = function (event, id) {

        $scope.Id = id;

        var confirm = $mdDialog.confirm()
            .title('Pergunta')
            .textContent('Deseja remover o carro?')
            .targetEvent(event)
            .ok('Sim')
            .cancel('Não');

        $mdDialog.show(confirm).then(

            function () {
                $scope.confirmaRemoverCarro();
            },

            function () {
                // hide dialog
            }
        );
    },

    $scope.confirmaRemoverCarro = function(){

        carrosFactory.removerCarro($scope.Id).then(function successCallback(response){
      
          $scope.showToast(response.data.Mensagem);
      
          $scope.listarCarro();
      
        }, function errorCallback(response){
            $scope.showToast(response.data.Mensagem);
        });
      
      },

      $scope.pesquisarCarro = function(){
    
        if(!$scope.carro_search_keywords){
            $scope.listarCarro();
            return;
        }

        var paginacao = {
            page: $scope.paging.current,
            start: $scope.paging.current * $scope.paging.qtde,
            limit: $scope.paging.qtde
        };

        carrosFactory.pesquisarCarro(paginacao, $scope.carro_search_keywords).then(function successCallback(response){
          $scope.paging.total = Math.trunc(response.data.Quantidade.Quantidade / $scope.paging.qtde) + 1;
          $scope.carros = response.data.Content;
        }, function errorCallback(response){
          $scope.showToast(response.data.Mensagem);
        });
      }

    function DialogController($scope, $mdDialog) {
        $scope.cancel = function () {
            $mdDialog.cancel();
        };
    }
});