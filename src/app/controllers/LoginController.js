(function () {
    angular
        .module('app')
        .controller('LoginController', [
            '$scope','loginFactory',
            LoginController
        ]);

    function LoginController($scope, loginFactory) {

        $scope.user = {};

        $scope.login = function(user){
            loginFactory.login($scope.user).then(function(good){
                $scope.setUser(good);
            });
        }

    }
})();
