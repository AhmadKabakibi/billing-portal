(function () {
    angular
        .module('app')
        .controller('LoginController', [
            '$scope', '$state', 'principal',
            LoginController
        ]);

    function LoginController($scope, $state, principal) {
        $scope.login = function () {

            // here, we fake authenticating and give a fake user
            principal.authenticate({
                name: 'Test User',
                roles: ['Admin']
            });

            if ($scope.returnToState) $state.go($scope.returnToState.name, $scope.returnToStateParams);
            else $state.go('home');
        };
    }
})();
