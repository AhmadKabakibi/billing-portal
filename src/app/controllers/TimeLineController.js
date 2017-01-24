(function () {
  angular
    .module('app')
    .controller('TimeLineController', ['navService', 'POsService', '$mdSidenav', '$mdBottomSheet', '$log', '$q', '$state', '$mdToast', 'principal', '$scope', '$rootScope', '$timeout', '$location', 'loginFactory', '$mdEditDialog', '$mdDialog', '$http', 'appConf', '$mdToast', 'Upload', '$timeout',
      TimeLineController
    ]);

  function TimeLineController (navService, POsService, $mdSidenav, $mdBottomSheet, $log, $q, $state, $mdToast, principal, $scope, $rootScope, $timeout, $location, loginFactory, $mdEditDialog, $mdDialog, $http, appConf, $mdToast, Upload, $timeout) {
    var vm = this;


    var last = {
      bottom: false,
      top: true,
      left: false,
      right: true
    };

    $scope.toastPosition = angular.extend({}, last);

    $scope.getToastPosition = function () {
      sanitizePosition();

      return Object.keys($scope.toastPosition)
        .filter(function (pos) {
          return $scope.toastPosition[pos];
        })
        .join(' ');
    };

    function sanitizePosition () {
      var current = $scope.toastPosition;

      if (current.bottom && last.top) current.top = false;
      if (current.top && last.bottom) current.bottom = false;
      if (current.right && last.left) current.left = false;
      if (current.left && last.right) current.right = false;

      last = angular.extend({}, current);
    }

    $scope.showSimpleStatus = function (status) {
      var pinTo = $scope.getToastPosition();
      $mdToast.show(
        $mdToast.simple()
          .textContent(status)
          .position(pinTo)
          .hideDelay(3000)
      );
    }

    $scope.discard = function () {
      $mdDialog.hide()
    }

    $scope.date = new Date();

    function actionsTimeline () {
      POsService.actionsTimeline({PONumber:$rootScope.POdetails[0].PONumber})
        .then(function (response) {
          $scope.timeline = response.data.data;
          //alert(JSON.stringify($scope.posHeader));
        }, function (error) {
          $scope.status = 'Unable to load received files data: ' + error.message;
          console.log($scope.status);
        });
    }

    actionsTimeline();

  }
})();
