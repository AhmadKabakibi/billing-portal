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
            Session.create(user.id, user.role, user.roleCode);

            return user;
        }

        authService.logout = function () {

            //var token = Session.id;
            Session.destroy();

            /*


             $http({
             method: 'POST',
             url:'http://randomurl.com/api/logout', data:{token:token}
             //    url:'http://localhost:9190/api/logout', data:{token:token}
             });

             */

        }

        authService.isAdmin = function () {

            return !!Session.id && (Session.roleCode === USER_ROLES.admin || Session.roleCode === USER_ROLES.superAdmin);
        }

        authService.isAuthenticated = function () {

            return !!Session.id;
        }

        authService.isAuthorized = function (authorizedRoles) {

            if (!angular.isArray(authorizedRoles)) {
                authorizedRoles = [authorizedRoles];
            }


            return (authService.isAuthenticated() &&
            authorizedRoles.indexOf(Session.roleCode) !== -1);
        };

        return authService;
    }
})();
