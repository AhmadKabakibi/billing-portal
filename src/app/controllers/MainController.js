(function () {

    angular
        .module('app')
        .controller('MainController', [
            'navService', 'POsService', '$mdSidenav', '$mdBottomSheet', '$log', '$q', '$state', '$mdToast', 'principal', '$mdEditDialog', '$scope', '$rootScope', '$timeout', '$location','loginFactory','$mdEditDialog', '$mdDialog', '$http','appConf',
            MainController
        ]);
    function MainController(navService, POsService, $mdSidenav, $mdBottomSheet, $log, $q, $state, $mdToast, principal, $mdEditDialog, $scope, $rootScope, $timeout, $location,loginFactory,$mdEditDialog, $mdDialog, $http, appConf) {
        var vm = this;

        vm.getAll=getAll

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
            {val: "30", str: "Last 30 days"},
            {val: "60", str: "Last 60 days"},
            {val: "7", str: "This week"},
            {val: "1", str: "Today"}
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
            multiSelect: false,
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
        $scope.columns = [{
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
                    //alert(JSON.stringify($scope.posHeader));
                }, function (error) {
                    $scope.status = 'Unable to load customer data: ' + error.message;
                    console.log($scope.status);
                });
        }
        getAll();

        $scope.loadPOHeader = function (params) {
            $scope.promise = $timeout(function () {
                // loading
                POsService.loadPOHeader(params)
                    .then(function (response) {
                        $scope.posHeader = response.data.data;
                    }, function (error) {
                        $scope.status = 'Unable to load partner data: ' + error.message;
                    });

            }, 2000);
        }

        $scope.logItem = function (item) {
            //getPOs({PONumber:user.PONumber,dateRange:range})
            POsService.getPOs({PONumber:item.PONumber})
                .then(function (response) {
                    $scope.selectedPO = response.data.data;
                    $rootScope.POdetails=response.data.data;
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
        /*Authorization*/

        $scope.currentUser = null;
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
            loginFactory.logout().then(function(res){
                $scope.currentUser=null;
                $rootScope.currentUser=null;

                $rootScope = $rootScope.$new(true);
                $scope = $scope.$new(true);

                $state.go('login', {}, {reload: true});
            });
        }
    }


})();
