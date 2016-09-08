(function () {

    angular
        .module('app')
        .controller('SettingsController', [
            '$scope', 'loginFactory',
            SettingsController
        ]);

    function SettingsController($scope, loginFactory) {

        $scope.user = {};
        $scope.userList=null;
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

        $scope.createUser = function (user) {
            loginFactory.newUser(user).then(function (good) {
                alert(good);
            });
        }

        function getAllUsers() {
            loginFactory.loadAllUsers()
                .then(function (response) {
                    $scope.userList = response.data.data;
                    //alert(JSON.stringify($scope.posHeader));
                }, function (error) {
                    $scope.status = 'Unable to load customer data: ' + error.message;
                    console.log($scope.status);
                });
        }

        getAllUsers();



        /*:D */
      /*  $scope._u_selected = [];
        $scope._u_limitOptions = [5, 10, 15];

        $scope._u_options = {
            rowSelection: true,
            multiSelect: true,
            autoSelect: true,
            decapitate: false,
            largeEditDialog: false,
            boundaryLinks: false,
            limitSelect: true,
            pageSelect: true
        };

        $scope._u_query = {
            order: 'name',
            limit: 5,
            page: 1
        };

        $scope.editComment = function (event, dessert) {
            event.stopPropagation(); // in case autoselect is enabled

            var editDialog = {
                modelValue: dessert.comment,
                placeholder: 'Add a comment',
                save: function (input) {
                    if(input.$modelValue === 'Donald Trump') {
                        input.$invalid = true;
                        return $q.reject();
                    }
                    if(input.$modelValue === 'Bernie Sanders') {
                        return dessert.comment = 'FEEL THE BERN!'
                    }
                    dessert.comment = input.$modelValue;
                },
                targetEvent: event,
                title: 'Add a comment',
                validators: {
                    'md-maxlength': 30
                }
            };

            var promise;

            if($scope.options.largeEditDialog) {
                promise = $mdEditDialog.large(editDialog);
            } else {
                promise = $mdEditDialog.small(editDialog);
            }

            promise.then(function (ctrl) {
                var input = ctrl.getInput();

                input.$viewChangeListeners.push(function () {
                    input.$setValidity('test', input.$modelValue !== 'test');
                });
            });
        };

        $scope._u_toggleLimitOptions = function () {
            $scope.limitOptions = $scope.limitOptions ? undefined : [5, 10, 15];
        };

        $scope._u_getTypes = function () {
            return ['Candy', 'Ice cream', 'Other', 'Pastry'];
        };

        $scope._u_loadStuff = function () {
            $scope.promise = $timeout(function () {
                // loading
            }, 2000);
        }

        $scope._u_logItem = function (item) {
            console.log(item.name, 'was selected');
        };

        $scope._u_logOrder = function (order) {
            console.log('order: ', order);
        };

        $scope._u_logPagination = function (page, limit) {
            console.log('page: ', page);
            console.log('limit: ', limit);
        }
*/

    }

})();
