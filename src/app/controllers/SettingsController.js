(function(){

  angular
    .module('app')
    .controller('SettingsController', [
      '$scope','loginFactory',
      SettingsController
    ]);

  function SettingsController($scope, loginFactory) {

    $scope.user = {};

    $scope.newUser = function(user){
      loginFactory.newUser($scope.user).then(function(good){
        alert(good);
      });
    }

  }

})();
