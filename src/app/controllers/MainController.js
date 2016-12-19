(function () {

    angular
        .module('app')
        .controller('MainController', [
            'navService', 'POsService', '$mdSidenav', '$mdBottomSheet', '$log', '$q', '$state', '$mdToast', 'principal', '$scope', '$rootScope', '$timeout', '$location', 'loginFactory', '$mdEditDialog', '$mdDialog', '$http', 'appConf', '$mdToast', 'Upload', '$timeout', '$filter', 'filterFilter',
            MainController
        ]);
    function MainController(navService, POsService, $mdSidenav, $mdBottomSheet, $log, $q, $state, $mdToast, principal, $scope, $rootScope, $timeout, $location, loginFactory, $mdEditDialog, $mdDialog, $http, appConf, $mdToast, Upload, $timeout, $filter, filterFilter) {
        var vm = this;

        vm.getAll = getAll

        /* $scope.$watch(function() { return $location.path(); }, function(newValue, oldValue){
         if ($scope.currentUser.isAuth && newValue != '/login'){
         //$location.path('/login');
         }else {
         $location.path('/login');
         }
         });*/

        $scope.posHeader = null;
        vm.menuItems = [];

        $scope.dateRange = [
            {name: 'All items', date: moment().subtract(10, 'year')},
            {name: 'Last 30 days', date: moment().subtract(1, 'month')},
            {name: 'Last 60 days', date: moment().subtract(2, 'month')},
            {name: 'This week', date: moment().subtract(7, 'days')},
            {name: 'Today', date: moment().subtract(1, 'days')}
        ];


        $scope.POStatus = [
            {val: "Pending", str: "Pending"},
            {val: "Accepted", str: "Accepted"},
            {val: "Invoiced", str: "Invoiced"},
            {val: "Rejected", str: "Rejected"},
            {val: "UnderReview", str: "Under Review"}
        ];

        //vm.selectItem = selectItem;
        //vm.toggleItemsList = toggleItemsList;
        //vm.title = $state.current.data.title;
        vm.title;

        navService
            .loadAllItems()
            .then(function (menuItems) {
                vm.menuItems = [].concat(menuItems);
            });

        /*  function toggleItemsList() {
         $mdSidenav('left').toggle();
         }

         function selectItem(item) {
         vm.title = item.name;
         vm.toggleItemsList();
         }
         */

        //PosService
        // Assume we have a $nutrition service that provides an API for communicating with the server
        $scope.options = {
            rowSelection: true,
            multiSelect: true,
            autoSelect: true,
            decapitate: false,
            largeEditDialog: false,
            boundaryLinks: false,
            limitSelect: true,
            pageSelect: true
        };

        $scope.selectedPO = null;
        $scope.selected = [];
        $scope.limitOptions = [5, 10, 15, {
            label: 'All',
            value: function () {
                return $scope.pos ? $scope.pos.count : 0;
            }
        }];

        $scope.query = {
            order: 'PONumber',
            limit: 5,
            page: 1
        };

        /*
         Details:
         Show the details in grid format. Below are the columns to show.
          Line This will be generated by our system and we should list the line items with the PO in the
         same order they were received in the PO export file.
          Item Code data element 0012
          Description data element 0013
          Warehouse code data element 0014
          Warehouse lookup this value using the warehouse code &amp; the “IM_Warehouse.xlsx” table
          Partner PO Number data element 0015
          Unit of measure data element 0016
          Quantity Ordered data element 0017
          Quantity backordered data element 0018
          Quantity invoiced data element 0019
          Unit Cost data element 0020
          Total data element 0021
         */

        // Order Information: This will include the PO header information.
        // for testing ngRepeat
        $scope.columns = [
            {
                name: ''
            }, {
                name: 'PO Number'
            }, {
                name: 'Partner'
            }, {
                name: 'Order Date'
            }, {
                name: 'Division data'
            }, {
                name: 'Order Type'
            }, {
                name: 'Partner Code'
            }, {
                name: 'Ship to Name'
            }, {
                name: 'Status data'
            }];

        /* // function that takes an array of objects
         // and returns an array of unique valued in the object
         // array for a given key.
         // this really belongs in a service, not the global window scope
         var unique = function (data, key) {
         var result = [];
         if(data.length){
         for (var i = 0; i < data.length; i++) {
         var value = data[i][key];
         if (result.indexOf(value) == -1) {
         result.push(value);
         }
         }
         return result;
         }
         return null;
         };

         // create a deferred object to be resolved later
         var PODeferred = $q.defer();

         // return a promise. The promise says, "I promise that I'll give you your
         // data as soon as I have it (which is when I am resolved)".
         $scope.posss = PODeferred.promise;

         // create a list of unique POs
         var uniquePO = unique($scope.posHeader, 'PONumber');

         // resolve the deferred object with the unique POs
         // this will trigger an update on the view
         PODeferred.resolve(uniquePO);
         */
        /**/

        $scope.onPaginate = function (page, limit) {
            console.log('Scope Page: ' + $scope.query.page + ' Scope Limit: ' + $scope.query.limit);
            console.log('Page: ' + page + ' Limit: ' + limit);

            $scope.promise = $timeout(function () {

            }, 2000);
        };
        /**/

        $scope.toggleLimitOptions = function () {
            $scope.limitOptions = $scope.limitOptions ? undefined : [5, 10, 15];
        };

        $scope.loadStuff = function () {
            $scope.promise = $timeout(function () {
                // loading
                getAll();
            }, 2000);
        }

        function getAll() {
            POsService.loadAllItems()
                .then(function (response) {
                    //$scope.posHeader = removeDuplicate(response.data.data, 'PONumber');
                    $scope.posHeader = response.data.data;
                    $scope.GlobalPosHeader=$scope.posHeader;

                    //alert(JSON.stringify($scope.posHeader));
                }, function (error) {
                    $scope.status = 'Unable to load customer data: ' + error.message;
                    console.log($scope.status);
                });

            POsService.getPartner()
                .then(function (response) {
                    //$scope.posHeader = removeDuplicate(response.data.data, 'PONumber');
                    $scope.Partners = response.data.data;
                    //alert(JSON.stringify($scope.posHeader));
                }, function (error) {
                    $scope.status = 'Unable to load customer Partners data: ' + error.message;
                    console.log($scope.status);
                });

        }

        getAll();

        $scope.filter = {PONumber:"",POStatus: "!!", PartnerCode: "!!"};

        $scope.loadPOHeader = function (params) {

            if (params.PartnerCode == "!!") {
                return $scope.posHeader = $scope.GlobalPosHeader;
            } else {
                return $scope.posHeader = $filter('filter')($scope.posHeader, {
                    PONumber: params.PONumber,
                    PartnerCode: params.PartnerCode,
                    POStatus: params.status
                })
            }


            /*  $scope.promise = $timeout(function () {
             // loading
             POsService.loadPOHeader(params)
             .then(function (response) {
             $scope.posHeader = response.data.data;
             }, function (error) {
             $scope.status = 'Unable to load partner data: ' + error.message;
             });

             }, 2000);*/

        }

        $scope.logItem = function (item) {
            //getPOs({PONumber:user.PONumber,dateRange:range})
        };

        $scope.getPODetails = function (po) {
            POsService.getPOs({PONumber: po.PONumber})
                .then(function (response) {
                    $scope.selectedPO = response.data.data;
                    $rootScope.POdetails = response.data.data;
                    //alert(item.PONumber + 'was selected' + JSON.stringify($scope.selectedPO) );
                    $state.go('details')//, {}, {reload: true});
                }, function (error) {
                    $scope.status = 'Unable to load partner data: ' + error.message;
                    console.log($scope.status);
                });
        };

        $scope.log = function (item) {
            console.log(item.name, 'was selected');
        };

        $scope.logOrder = function (order) {
            console.log('order: ', order);
        };

        $scope.logPagination = function (page, limit) {
            console.log('page: ', page);
            console.log('limit: ', limit);
        }

        //Accept PO
        $scope.Accept = function (pos) {
            POsService.acceptPO(pos.map(function (a) {
                    return a.PONumber;
                }))
                .then(function (response) {
                    $scope.loadStuff();
                    $scope.selected = [];
                }, function (error) {
                    $scope.status = 'Unable to load partner data: ' + error.message;
                    console.log($scope.status);
                });

        };
        //Change Po

        /**/

        $scope.Change = function (event, POSelected) {
            // Appending dialog to document.body to cover sidenav in docs app

            var confirm = $mdDialog.prompt()
                .title('Enter your Comments')
                .placeholder('1000 characters max')
                .ariaLabel('comment')
                .targetEvent(event)
                .ok('Send')
                .cancel('Discard');

            var maxPo = $mdDialog.confirm()
                .title('Warning')
                .textContent('You can only select one PO at a time when requesting a change')
                .targetEvent(event)
                .ok('ok');

            if ($scope.selected.length > 1) {
                $mdDialog.show(maxPo).then(function () {

                }, function () {

                });
            } else {

                $mdDialog.show(confirm).then(function (comment) {

                    //todo send email to admin r-pac

                    POsService.rejectePO({PONumber: POSelected[0].PONumber, comment: comment})
                        .then(function (response) {

                            $scope.loadStuff();
                            $scope.selected = [];

                        }, function (error) {
                            $scope.status = 'Unable to load partner data: ' + error.message;
                            console.log($scope.status);
                        });

                }, function () {

                });
            }
        };


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

        function sanitizePosition() {
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

        /*Authorization*/

        //$scope.currentUser = null;
        // $scope.isAuthorized = AuthService.isAuthorized;

        $scope.setUser = function (user) {

            $scope.currentUser = user;
            $rootScope.currentUser = user;

            $state.go('dashboard')//, {}, {reload: true});

            /* var p = null;
             if (user.type == 'admin') {
             user.roleCode = USER_ROLES.superAdmin;
             p = 'dashboard';
             } else if (user.role == 'normal') {
             user.roleCode = USER_ROLES.normal;
             p = 'dashboard';
             }
             if (p !== null) {
             p = '/' + p;
             $scope.currentUser = user;
             $rootScope.currentUser = user;
             // AuthService.newSession(user);
             $location.path(p)
             } else
             alert('Unable to Log You In :(');*/
        }

        $scope.onReorder = function (order) {

            console.log('Scope Order: ' + $scope.query.order);
            console.log('Order: ' + order);

            $scope.promise = $timeout(function () {

            }, 2000);
        };

        $scope.logout = function () {
            loginFactory.logout().then(function (res) {
                $scope.currentUser = null;
                $rootScope.currentUser = null;

                $rootScope = $rootScope.$new(true);
                $scope = $scope.$new(true);

                $state.go('login', {}, {reload: true});
            });
        }

        /*Receivedfiles*/

        /*:D */

        $scope.gridReceived = [{
            name: 'File name'
        }, {
            name: 'Date received'
        }, {
            name: 'Status'
        }, {
            name: 'Failure reason'
        }, {
            name: 'Download'
        }];


        function getAllReceived() {
            POsService.receivedFiles()
                .then(function (response) {
                    $scope.receivedList = response.data.data;
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

        /*PODetails Grid*/
        $scope.girdPoDetails = [{
            name: 'Line'
        }, {
            name: 'Item Code'
        }, {
            name: 'Description'
        }, {
            name: 'Warehouse code'
        }, {
            name: 'Partner PO Number'
        }, {
            name: 'Unit of measure'
        }, {
            name: 'Quantity Ordered'
        }, {
            name: 'Quantity backordered'
        }, {
            name: 'Quantity invoiced'
        }, {
            name: 'Unit Cost'
        }, {
            name: 'Total'
        }];

        $scope._pd_limitOptions = [5, 10, 15];
        $scope._pd_options = {
            rowSelection: false,
            multiSelect: false,
            autoSelect: false,
            decapitate: false,
            largeEditDialog: true,
            boundaryLinks: false,
            limitSelect: true,
            pageSelect: true
        };

        $scope._pd_query = {
            order: 'name',
            limit: 5,
            page: 1
        };

        $scope._pd_toggleLimitOptions = function () {
            $scope.limitOptions = $scope.limitOptions ? undefined : [5, 10, 15];
        };

        $scope._pd_getTypes = function () {
            return ['Success', 'Failed'];
        };

        $scope._pd_loadStuff = function () {
            $scope.promise = $timeout(function () {
                // loading
                getAllReceived();
            }, 2000);
        }

        $scope._pd_logOrder = function (order) {
            console.log('order: ', order);
        };

        $scope._pd_logPagination = function (page, limit) {
            console.log('page: ', page);
            console.log('limit: ', limit);
        }

        /*Acknowledge and invoice*/


        $scope.AcknowledgeInvoice = function (evt) {
            $mdDialog.show({
                targetEvent: evt,
                locals: {parent: $scope, root: $rootScope},
                controller: angular.noop,
                controllerAs: 'ctrl',
                bindToController: true,
                templateUrl: 'invoice.tmpl.html',
                clickOutsideToClose: true
                /*    template:
                 '<md-dialog>' +
                 '  <md-content>{{ctrl.parent.greeting}}, world !</md-content>' +
                 '  <div class="md-actions">' +
                 '    <md-button ng-click="ctrl.parent.dialogOpen=false;ctrl.parent.hideDialog()">' +
                 '      Close' +
                 '    </md-button>' +
                 '  </div>' +
                 '</md-dialog>'*/
            });
        };
    }
})();
