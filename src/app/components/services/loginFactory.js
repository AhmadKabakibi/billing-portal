(function () {
    'use strict';
    angular.module('app')
        .factory('loginFactory', [
            '$http', '$q',
            login
        ]);

    function login($http, $q) {

        var ajsbsFactory = {};
        $http.defaults.useXDomain = true;

        ajsbsFactory.login = function (user) {
            var deferred = $q.defer();
            /*
             deferred.resolve(user);*/

            $http({
                method: 'POST',
                url: 'http://localhost:3000/auth/authenticate', data: {username: user.username, password: user.password}

            }).success(function (data) {
                //debugger;
                if(data.success){
                    deferred.resolve(data.user);
                }else {
                    deferred.reject();
                }
            }).error(function (err) {
                deferred.reject(err);
            });

            return deferred.promise;
        }
        return ajsbsFactory;
    }
})();

