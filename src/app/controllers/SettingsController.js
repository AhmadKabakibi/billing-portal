(function () {

    angular
        .module('app')
        .controller('SettingsController', [
            '$rootScope', '$scope', '$state', 'loginFactory', '$mdEditDialog', '$mdDialog', '$q', '$timeout', '$http', 'appConf',
            SettingsController
        ]);

    function SettingsController($rootScope, $scope, $state, loginFactory, $mdEditDialog, $mdDialog, $q, $timeout, $http, appConf) {
        /*:D */
        $scope.user = {};
        $scope.userList = null;
        $scope.gridUsers = [{
            name: 'Username'
        }, {
            name: 'Partner Code'
        }, {
            name: 'Email'
        }, {
            name: 'Role'
        }, {
            name: 'Actions'
        }];

        $scope.createUser = function (user) {
            loginFactory.newUser(user).then(function (good) {
                alert(good);
                $state.go('settings');//, {}, {reload: true});
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
        $scope._u_selected = [];
        $scope._u_limitOptions = [5, 10, 15];
        $scope._u_options = {
            rowSelection: true,
            multiSelect: false,
            autoSelect: false,
            decapitate: false,
            largeEditDialog: true,
            boundaryLinks: false,
            limitSelect: true,
            pageSelect: true
        };

        $scope._u_query = {
            order: 'name',
            limit: 5,
            page: 1
        };

        $scope.modify = function (event, newUser) {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                .title('Confirmation')
                .textContent('Modify user ' + JSON.stringify(newUser))
                .targetEvent(event)
                .ok('modify')
                .cancel('cancel');
            $mdDialog.show(confirm).then(function () {
                var deferred = $q.defer();

                $http({
                    method: 'POST',
                    url: appConf.baseURL + '/api/user/update',
                    data: {
                        id: newUser.id,
                        username: newUser.username,
                        password: newUser.password,
                        type: newUser.type,
                        code: newUser.code,
                        email: newUser.email
                    }
                }).success(function (data) {
                    if (data.success) {
                        deferred.resolve(data);
                        getAllUsers();
                        $state.go('settings');
                    } else {
                        deferred.reject();
                    }
                }).error(function (err, status, headers, config) {
                    alert("modifying user field");
                    deferred.reject(err);
                });


            }, function () {
                $state.go('settings');
            });
        };

        $scope.delete = function (event, selected_user) {
            var deferred = $q.defer();
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

        }

        $scope._u_toggleLimitOptions = function () {
            $scope.limitOptions = $scope.limitOptions ? undefined : [5, 10, 15];
        };

        $scope._u_getTypes = function () {
            return ['r-pac Admin', 'Partner'];
        };

        $scope._u_loadStuff = function () {
            $scope.promise = $timeout(function () {
                // loading
                getAllUsers();
            }, 2000);
        }

        $scope._u_logItem = function (item) {
            $rootScope._u_selectedUser = item;
            console.log(item.username, 'was selected');
        };

        $scope._u_logOrder = function (order) {
            console.log('order: ', order);
        };

        $scope._u_logPagination = function (page, limit) {
            console.log('page: ', page);
            console.log('limit: ', limit);
        }
    }

})();
