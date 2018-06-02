MyApp.controller('carrosController', function ($scope, $mdDialog, $mdToast, carrosFactory) {

    $scope.isLoading = false;
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
            $scope.listarCarro();
        }else{
            $scope.pesquisarCarro();
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

    $scope.listarCarro = function () {
        
        var paginacao = {
            page: $scope.paging.current,
            start: $scope.paging.current * $scope.paging.qtde,
            limit: $scope.paging.qtde
        };

        $scope.isLoading = true;

        carrosFactory.listarCarro(paginacao).then(function successCallback(response) {
            $scope.isLoading = false;
            $scope.paging.total = Math.ceil(response.data.Quantidade.Quantidade / $scope.paging.qtde);
            $scope.carros = response.data.Content;
        }, function errorCallback(response) {
            $scope.isLoading = false;
            $scope.showToast(response.data.Message);
        });

    },

    $scope.showNovoCarroForm = function (event) {
        $scope.clearCarrosForm();
        $mdDialog.show({
            controller: DialogController,
            templateUrl: './app/carros/cadastro_carros.template.html',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            scope: $scope,
            preserveScope: true,
            fullscreen: true
        });
    },

    $scope.salvarCarro = function () {

        $scope.isLoading = true;

        carrosFactory.salvarCarro($scope).then(function successCallback(response) {
            $scope.isLoading = false;
            $scope.showToast(response.data.Mensagem);

            // refresh the list
            $scope.listarCarro();

            // close dialog
            $scope.cancel();

            // remove form values
            $scope.clearCarrosForm();

        }, function errorCallback(response) {
            $scope.isLoading = false;
            $scope.showToast(response.data.Mensagem);
            $scope.clearCarrosForm();
        });
    },

    $scope.clearCarrosForm = function () {
        $scope.Id = "";
        $scope.Descricao = "";
    },

    $scope.editarCarro = function (id) {

        // get carro to be edited
        carrosFactory.editarCarro(id).then(function successCallback(response) {

            // put the values in form
            $scope.Id = response.data.Content.Id;
            $scope.Descricao = response.data.Content.Descricao;

            $mdDialog.show({
                controller: DialogController,
                templateUrl: './app/carros/cadastro_carros.template.html',
                parent: angular.element(document.body),
                clickOutsideToClose: true,
                scope: $scope,
                preserveScope: true,
                fullscreen: true
            }).then(
                function () { },

                // user clicked 'Cancel'
                function () {
                    $scope.clearCarrosForm();
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

        $scope.isLoading = true;

        carrosFactory.pesquisarCarro(paginacao, $scope.carro_search_keywords).then(function successCallback(response){
            $scope.isLoading = false;
            $scope.paging.total = Math.ceil(response.data.Quantidade.Quantidade / $scope.paging.qtde);
            $scope.carros = response.data.Content;
        }, function errorCallback(response){
            $scope.isLoading = false;
            
            $scope.showToast(response.data.Mensagem);
        });
      }

    function DialogController($scope, $mdDialog) {
        $scope.cancel = function () {
            $mdDialog.cancel();
        };
    }
});