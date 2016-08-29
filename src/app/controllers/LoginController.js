(function () {
    angular
        .module('app')
        .controller('LoginController', [
            '$scope','loginFactory',
            LoginController
        ]);

    function LoginController($scope, loginFactory) {

        $scope.user = {};
        $scope.user.role = 'superAdmin'

        $scope.login = function(user){
            loginFactory.login($scope.user).then(function(good){
                $scope.setUser(good);
            });
        }

       /* $scope.login = function () {
            // here, we fake authenticating and give a fake user

           /!* principal.authenticate({
                name: 'Test User',
                roles: ['Admin']
            });*!/

            if ($scope.returnToState) $state.go($scope.returnToState.name, $scope.returnToStateParams);
            else $state.go('home');
        };*/
    }
})();
