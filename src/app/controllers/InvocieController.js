(function () {
    angular
        .module('app')
        .controller('InvoiceController', [    'navService', 'POsService', '$mdSidenav', '$mdBottomSheet', '$log', '$q', '$state', '$mdToast', 'principal', '$scope', '$rootScope', '$timeout', '$location', 'loginFactory', '$mdEditDialog', '$mdDialog', '$http', 'appConf', '$mdToast', 'Upload', '$timeout',
            InvoiceController
        ]);

    function InvoiceController(navService, POsService, $mdSidenav, $mdBottomSheet, $log, $q, $state, $mdToast, principal, $scope, $rootScope, $timeout, $location, loginFactory, $mdEditDialog, $mdDialog, $http, appConf, $mdToast, Upload, $timeout) {
        var vm = this;


    }
})();
