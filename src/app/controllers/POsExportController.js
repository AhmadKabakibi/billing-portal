(function () {

    angular
        .module('app')
        .controller('POsExportController', [
            'navService', 'POsService', '$mdSidenav', '$mdBottomSheet', '$log', '$q', '$state', '$mdToast', 'principal', '$scope', '$rootScope', '$timeout', '$location', 'loginFactory', '$mdEditDialog', '$mdDialog', '$http', 'appConf', '$mdToast', 'Upload', '$timeout', '$filter', 'filterFilter',
            POsExportController
        ]);

    function POsExportController (navService, POsService, $mdSidenav, $mdBottomSheet, $log, $q, $state, $mdToast, principal, $scope, $rootScope, $timeout, $location, loginFactory, $mdEditDialog, $mdDialog, $http, appConf, $mdToast, Upload, $timeout, $filter, filterFilter) {
        var vm = this;

        $scope.gridExportedFiles = [{
            name: 'File name'
        }, {
            name: 'Date generated'
        },{
            name: 'Download'
        }];


        function getAllReceived () {
            POsService.exportedFiles()
                .then(function (response) {
                    $scope.exportedList = response.data.data;
                    //alert(JSON.stringify($scope.posHeader));
                }, function (error) {
                    $scope.status = 'Unable to load received files data: ' + error.message;
                    console.log($scope.status);
                });
        }

        getAllReceived();

        $scope._f_selected = [];
        $scope._f_limitOptions = [5, 10, 15];
        $scope._f_options = {
            rowSelection: false,
            multiSelect: false,
            autoSelect: false,
            decapitate: false,
            largeEditDialog: true,
            boundaryLinks: false,
            limitSelect: true,
            pageSelect: true
        };

        $scope._f_query = {
            order: 'name',
            limit: 5,
            page: 1
        };

        $scope.downloadArchivedFile = function (event, selected_fileName) {
            POsService.DownloadArchiveFile(selected_fileName)
                .then(function (response) {
                }, function (error) {
                    $scope.status = 'Unable to Download Archive File from FTP ' + error.message;
                    console.log($scope.status);
                });
            /*  var deferred = $q.defer();
             var promise = $mdEditDialog.large({
             title: "Delete Selected User",
             ok: "delete",
             placeholder: 'reason (optional) ',
             save: function (input) {
             $http({
             method: 'POST',
             url: appConf.baseURL + '/api/user/delete',
             data: {id: selected_user[0].id}
             }).success(function (data) {
             if (data.success) {
             deferred.resolve(data);
             getAllUsers();
             //$state.go('settings', {}, {reload: true});
             } else {
             deferred.reject();
             }
             }).error(function (err, status, headers, config) {
             deferred.reject(err);
             });


             },
             targetEvent: event
             });
             promise.then(function (ctrl) {

             });
             */
        }

        $scope._f_toggleLimitOptions = function () {
            $scope.limitOptions = $scope.limitOptions ? undefined : [5, 10, 15];
        };

        $scope._f_getTypes = function () {
            return ['Success', 'Failed'];
        };

        $scope._f_loadStuff = function () {
            $scope.promise = $timeout(function () {
                // loading
                getAllReceived();
            }, 2000);
        }

        $scope._f_logItem = function (item) {
            $rootScope._f_selectedReceivedFile = item;
        };

        $scope._f_logOrder = function (order) {
            console.log('order: ', order);
        };

        $scope._f_logPagination = function (page, limit) {
            console.log('page: ', page);
            console.log('limit: ', limit);
        }




    }

})();