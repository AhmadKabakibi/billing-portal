(function () {
    angular
        .module('app')
        .controller('LoginController', [
            '$scope','loginFactory','$mdSidenav',
            LoginController
        ]);

    function LoginController($scope, loginFactory,$mdSidenav) {

        $scope.user = {};
        $scope.user.role = 'superAdmin'


        $scope.login = function(user){
            loginFactory.login($scope.user).then(function(good){
                $scope.setUser(good);
            });
        }
    }
})();
