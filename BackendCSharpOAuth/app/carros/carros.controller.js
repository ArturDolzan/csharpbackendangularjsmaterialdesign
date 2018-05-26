app.controller('carrosController', function ($scope, $mdDialog, $mdToast, carrosFactory) {

    $scope.showToast = function (message) {
        $mdToast.show(
            $mdToast.simple()
                .textContent(message)
                .hideDelay(3000)
                .position("top left")
        );
    },

    // read carros
    $scope.readCarros = function () {

        // use carros factory
        carrosFactory.readCarros().then(function successCallback(response) {
            $scope.carros = response.data.Content;
        }, function errorCallback(response) {
            $scope.showToast(response.data.Message);
        });

    },

    $scope.showNovoCarroForm = function (event) {

        $mdDialog.show({
            controller: DialogController,
            templateUrl: './app/carros/novo_carros.template.html',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            scope: $scope,
            preserveScope: true,
            fullscreen: true // Only for -xs, -sm breakpoints.
        });
    },

    $scope.createCarro = function () {

        carrosFactory.createCarro($scope).then(function successCallback(response) {
          
            $scope.showToast(response.data.Mensagem);

            // refresh the list
            $scope.readCarros();

            // close dialog
            $scope.cancel();

            // remove form values
            $scope.clearCarrosForm();

        }, function errorCallback(response) {
            $scope.showToast(response.data.Mensagem);
        });
    },

    $scope.clearCarrosForm = function () {
        $scope.Id = "";
        $scope.Descricao = "";
    },

    $scope.visualizar = function (id) {

        // get carro to be edited
        carrosFactory.visualizar(id).then(function successCallback(response) {

            // put the values in form
            $scope.Id = response.data.Content.Id;
            $scope.Descricao = response.data.Content.Descricao;
            $scope.Ativo = response.data.Content.Ativo;

            $mdDialog.show({
                controller: DialogController,
                templateUrl: './app/carros/visualizar_carros.template.html',
                parent: angular.element(document.body),
                clickOutsideToClose: true,
                scope: $scope,
                preserveScope: true,
                fullscreen: true
            }).then(
                function () { },

                // user clicked 'Cancel'
                function () {
                    // clear modal content
                    $scope.clearCarrosForm();
                }
            );

        }, function errorCallback(response) {
            $scope.showToast(response.data.Mensagem);
        });

    }

    // showUpdateProductForm will be here

    function DialogController($scope, $mdDialog) {
        $scope.cancel = function () {
            $mdDialog.cancel();
        };
    }
});