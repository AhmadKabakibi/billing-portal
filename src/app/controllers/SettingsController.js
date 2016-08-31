(function () {

    angular
        .module('app')
        .controller('SettingsController', [
            '$scope', 'loginFactory',
            SettingsController
        ]);

    function SettingsController($scope, loginFactory) {

        $scope.user = {};
        /*
         Grid:
         Username
         Partner Code if more than one partner is assigned to the user  multiple partner codesare separated by
         comma’s
         Email
         Role
         Action (edit / delete)*/
        $scope.gridUsers = [{
            name: 'Username'
        }, {
            name: 'Partner Code'
        }, {
            name: 'Email'
        }, {
            name: 'Role'
        }, {
            name: 'Action'
        }];

        $scope.newUser = function (user) {
            loginFactory.newUser($scope.user).then(function (good) {
                alert(good);
            });
        }

    }

})();
