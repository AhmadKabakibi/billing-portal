(function () {

    angular
        .module('app')
        .controller('MainController', [
            'navService', 'POsService', '$mdSidenav', '$mdBottomSheet', '$log', '$q', '$state', '$mdToast', 'principal', '$mdEditDialog', '$scope', '$rootScope', '$timeout', '$location', 'USER_ROLES', 'AuthService',
            MainController
        ]);

    function MainController(navService, POsService, $mdSidenav, $mdBottomSheet, $log, $q, $state, $mdToast, principal, $mdEditDialog, $scope, $rootScope, $timeout, $location, USER_ROLES, AuthService) {
        var vm = this;

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


        vm.selectItem = selectItem;
        vm.toggleItemsList = toggleItemsList;
        //vm.title = $state.current.data.title;
        vm.title;

        navService
            .loadAllItems()
            .then(function (menuItems) {
                vm.menuItems = [].concat(menuItems);
            });

        function toggleItemsList() {
            $mdSidenav('left').toggle();
        }

        function selectItem(item) {
            vm.title = item.name;
            vm.toggleItemsList();
        }

        /*
         vm.signout = function() {
         principal.authenticate(null);
         $state.go('login');
         }*/

        //PosService
        // Assume we have a $nutrition service that provides an API for communicating with the server
        $scope.options = {
            rowSelection: true,
            multiSelect:false,
            autoSelect: false,
            decapitate: false,
            largeEditDialog: false,
            boundaryLinks: false,
            limitSelect: true,
            pageSelect: true
        };

        $scope.selected = [];
        $scope.limitOptions = [5, 10, 15, {
            label: 'All',
            value: function () {
                return $scope.pos ? $scope.pos.count : 0;
            }
        }];

        $scope.query = {
            order: 'name',
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

        function getAll() {
            POsService.loadAllItems()
                .then(function (response) {
                    $scope.posHeader = response.data.data;
                    //alert(JSON.stringify($scope.posHeader));
                }, function (error) {
                    $scope.status = 'Unable to load customer data: ' + error.message;
                    console.log($scope.status);
                });
        }

        //getAll();

        $scope.getPOs = function (params) {
            console.log(params.PONumber + " @@ " + params.dateRange);
            POsService.getPOs(params)
                .then(function (response) {
                    $scope.posHeader = response.data.data;
                }, function (error) {
                    $scope.status = 'Unable to load partner data: ' + error.message;
                    console.log($scope.status);
                });
        }

        /*
         $scope.pos = {
         "count": 9,
         "data": [
         {
         "name": "Frozen yogurt",
         "type": "Ice cream",
         "calories": {"value": 159.0},
         "fat": {"value": 6.0},
         "carbs": {"value": 24.0},
         "protein": {"value": 4.0},
         "sodium": {"value": 87.0},
         "calcium": {"value": 14.0},
         "iron": {"value": 1.0},
         "comment": "Not as good as the real thing."
         }, {
         "name": "Ice cream sandwich",
         "type": "Ice cream",
         "calories": {"value": 237.0},
         "fat": {"value": 9.0},
         "carbs": {"value": 37.0},
         "protein": {"value": 4.3},
         "sodium": {"value": 129.0},
         "calcium": {"value": 8.0},
         "iron": {"value": 1.0}
         }, {
         "name": "Eclair",
         "type": "Pastry",
         "calories": {"value": 262.0},
         "fat": {"value": 16.0},
         "carbs": {"value": 24.0},
         "protein": {"value": 6.0},
         "sodium": {"value": 337.0},
         "calcium": {"value": 6.0},
         "iron": {"value": 7.0}
         }, {
         "name": "Cupcake",
         "type": "Pastry",
         "calories": {"value": 305.0},
         "fat": {"value": 3.7},
         "carbs": {"value": 67.0},
         "protein": {"value": 4.3},
         "sodium": {"value": 413.0},
         "calcium": {"value": 3.0},
         "iron": {"value": 8.0}
         }, {
         "name": "Jelly bean",
         "type": "Candy",
         "calories": {"value": 375.0},
         "fat": {"value": 0.0},
         "carbs": {"value": 94.0},
         "protein": {"value": 0.0},
         "sodium": {"value": 50.0},
         "calcium": {"value": 0.0},
         "iron": {"value": 0.0}
         }, {
         "name": "Lollipop",
         "type": "Candy",
         "calories": {"value": 392.0},
         "fat": {"value": 0.2},
         "carbs": {"value": 98.0},
         "protein": {"value": 0.0},
         "sodium": {"value": 38.0},
         "calcium": {"value": 0.0},
         "iron": {"value": 2.0}
         }, {
         "name": "Honeycomb",
         "type": "Other",
         "calories": {"value": 408.0},
         "fat": {"value": 3.2},
         "carbs": {"value": 87.0},
         "protein": {"value": 6.5},
         "sodium": {"value": 562.0},
         "calcium": {"value": 0.0},
         "iron": {"value": 45.0}
         }, {
         "name": "Donut",
         "type": "Pastry",
         "calories": {"value": 452.0},
         "fat": {"value": 25.0},
         "carbs": {"value": 51.0},
         "protein": {"value": 4.9},
         "sodium": {"value": 326.0},
         "calcium": {"value": 2.0},
         "iron": {"value": 22.0}
         }, {
         "name": "KitKat",
         "type": "Candy",
         "calories": {"value": 518.0},
         "fat": {"value": 26.0},
         "carbs": {"value": 65.0},
         "protein": {"value": 7.0},
         "sodium": {"value": 54.0},
         "calcium": {"value": 12.0},
         "iron": {"value": 6.0}
         }
         ]
         }
         */

        $scope.toggleLimitOptions = function () {
            $scope.limitOptions = $scope.limitOptions ? undefined : [5, 10, 15];
        };

        $scope.getTypes = function () {
            return ['Candy', 'Ice cream', 'Other', 'Pastry'];
        };

        $scope.onPaginate = function (page, limit) {
            console.log('Scope Page: ' + $scope.query.page + ' Scope Limit: ' + $scope.query.limit);
            console.log('Page: ' + page + ' Limit: ' + limit);

            $scope.promise = $timeout(function () {

            }, 2000);
        };

        $scope.deselect = function (item) {
            alert(item.PONumber, 'was deselected');
        };

        $scope.log = function (item) {
            alert(item.PONumber, 'was selected');
        };

        $scope.loadStuff = function () {
            $scope.promise = $timeout(function () {

            }, 2000);
        };

        $scope.onReorder = function (order) {

            console.log('Scope Order: ' + $scope.query.order);
            console.log('Order: ' + order);

            $scope.promise = $timeout(function () {

            }, 2000);
        };

        /*Authorization*/

        $scope.currentUser = null;
        $scope.isAuthorized = AuthService.isAuthorized;

        $scope.setUser = function (user) {

            var p = null;
            if (user.type == 'admin') {
                user.roleCode = USER_ROLES.superAdmin;
                p = 'dashboard';
            } else if (user.role == 'user') {
                user.roleCode = USER_ROLES.normal;
                p = 'profile';
            }

            if (p !== null) {
                p = '/' + p;
                $scope.currentUser = user;
                $rootScope.currentUser = user;
                AuthService.newSession(user);

                $location.path(p)


            } else
                alert('Unable to Log You In :(');

        }


    }


})();
