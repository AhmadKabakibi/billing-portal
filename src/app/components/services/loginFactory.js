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

            /*var deferred = $q.defer();
            deferred.resolve(user);

            return deferred.promise;
            */

             $http({
             method:'POST',
             url:'/auth/authenticate', data:{username:user.username,password:user.password}

             }).success(function(data){

             defer.resolve(data);

             }).error(function(err){
             deferred.reject(err);

             });


        }
        return ajsbsFactory;
    }
})();

