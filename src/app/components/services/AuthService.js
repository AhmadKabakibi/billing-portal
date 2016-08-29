(function () {
    'use strict';
    angular.module('app')
        .factory('AuthService', [
            '$http', 'Session',
            authorization
        ]);

    function authorization($http, Session) {
        var authService = {};

        authService.redirect = true;

        authService.newSession = function (user) {
            Session.create(user.id, user.type, user.roleCode);
            return user;
        }

        authService.logout = function () {
            Session.destroy();

             $http({
             method: 'GET',
             url:'http://localhost:3000/auth/logout'
             });
        }

        authService.isAdmin = function () {
            console.log(Session.id+' :@: '+Session.roleCode)
            return !!Session.id && (Session.roleCode === USER_ROLES.superAdmin);
        }

        authService.isAuthenticated = function () {
            return !!Session.id;
        }

        authService.isAuthorized = function (authorizedRoles) {

            if (!angular.isArray(authorizedRoles)) {
                authorizedRoles = [authorizedRoles];
            }


            return (authService.isAuthenticated() && authorizedRoles.indexOf(Session.roleCode) !== -1);
        };

        return authService;
    }
})();
