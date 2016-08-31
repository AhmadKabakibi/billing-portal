'use strict';

angular.module('angularMaterialAdmin', ['ngAnimate', 'ngCookies', 'ngTouch',
        'ngSanitize', 'ui.router', 'ngMaterial', 'nvd3', 'app', 'permission',
        'permission.ui'])

    .config(function ($stateProvider, $urlRouterProvider, $mdThemingProvider,
                      $mdIconProvider, USER_ROLES) {
        $stateProvider
            .state('site', {
                abstract: true,
                templateUrl: 'app/views/main.html',
                controller: 'MainController',
                controllerAs: 'vm'
            })
            .state('login', {
                parent: 'site',
                url: '/login',
                templateUrl: 'app/views/login.html',
                controller: "LoginController"
            })

            .state('dashboard', {
                parent: 'site',
                url: '/dashboard',
                templateUrl: 'app/views/dashboard.html',
                controller: 'POsController',
                controllerAs: 'vm',
                data: {
                    title: 'dashboard',
                    authorizedRoles: [USER_ROLES.superAdmin]
                }
            })
            .state('settings', {
                parent: 'site',
                url: '/settings',
                templateUrl: 'app/views/settings.html',
                controller: 'SettingsController',
                controllerAs: 'vm',
                data: {
                    title: 'settings',
                    authorizedRoles: [USER_ROLES.superAdmin]
                }
            })
            .state('user', {
                parent: 'site',
                url: '/newUser',
                templateUrl: 'app/views/newUser.html',
                controller: 'SettingsController',
                controllerAs: 'vm',
                data: {
                    title: 'settings',
                    authorizedRoles: [USER_ROLES.superAdmin]
                }
            })
            .state('details', {
                parent: 'site',
                url: '/details',
                templateUrl: 'app/views/poDetails.html',
                controller: 'POsController',
                controllerAs: 'vm',
                data: {
                    title: 'details',
                    authorizedRoles: [USER_ROLES.superAdmin]
                }
            })
            .state('exported', {
                parent: 'site',
                url: '/exported',
                controller: 'POsController',
                templateUrl: 'app/views/exported.html',
                data: {
                    title: 'exported',
                    authorizedRoles: [USER_ROLES.superAdmin]
                }
            })

            .state('received', {
                parent: 'site',
                url: '/received',
                controller: 'POsController',
                templateUrl: 'app/views/received.html',
                data: {
                    title: 'received',
                    authorizedRoles: [USER_ROLES.superAdmin]
                }
            });

        $urlRouterProvider.otherwise('login');

        /*
         $urlRouterProvider.otherwise(function ($injector) {
         var $state = $injector.get('$state');
         $state.go('login');
         });
         */

        $mdThemingProvider
            .theme('default')
            .primaryPalette('grey', {
                'default': '600'
            })
            .accentPalette('teal', {
                'default': '500'
            })
            .warnPalette('defaultPrimary');

        $mdThemingProvider.theme('dark', 'default')
            .primaryPalette('defaultPrimary')
            .dark();

        $mdThemingProvider.theme('grey', 'default')
            .primaryPalette('grey');

        $mdThemingProvider.theme('custom', 'default')
            .primaryPalette('defaultPrimary', {
                'hue-1': '50'
            });

        $mdThemingProvider.definePalette('defaultPrimary', {
            '50': '#FFFFFF',
            '100': 'rgb(255, 198, 197)',
            '200': '#E75753',
            '300': '#E75753',
            '400': '#E75753',
            '500': '#E75753',
            '600': '#E75753',
            '700': '#E75753',
            '800': '#E75753',
            '900': '#E75753',
            'A100': '#E75753',
            'A200': '#E75753',
            'A400': '#E75753',
            'A700': '#E75753'
        });
        $mdIconProvider.icon('user', 'assets/images/user.svg', 64);
    })
    /*
     .run(['$rootScope', '$state', '$stateParams', 'authorization', 'principal',
     function ($rootScope, $state, $stateParams, authorization, principal) {
     $rootScope.$on('$stateChangeStart', function (event, toState, toStateParams) {
     $rootScope.toState = toState;
     $rootScope.toStateParams = toStateParams;

     if (principal.isIdentityResolved()) authorization.authorize();
     });
     }
     ])*/

    /*.run(function (PermRoleStore, appConf) {
     PermRoleStore.defineRole('AUTHORIZED', function () {
     return appConf.isAuthorized;
     });
     PermRoleStore.defineRole('ADMIN', function () {
     return appConf.isAdmin;
     });
     PermRoleStore.defineRole('USER', function () {
     return appConf.isUser;
     });
     })


     .value('appConf', {
     isAuthorized: true,
     isAdmin: true,
     isUser: true
     })*/

    .run(function ($rootScope, $state, $http, AUTH_EVENTS, AuthService) {

        $rootScope.$on('$stateChangeStart', function (event, next,nextParams){
            if (next.name !== 'login') {
                var authorizedRoles = next.data.authorizedRoles;

                if (!AuthService.isAuthorized(authorizedRoles)) {

                    event.preventDefault();

                    if (AuthService.isAuthenticated())
                        $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
                    else
                        $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);

                    $state.go('login');
                    //alert('Access Denied');
                }
            } else if (next.name == 'settings' && AuthService.isAdmin()) {
                $state.go('settings');
            }

        })

    })

    .constant('AUTH_EVENTS', {
        loginSuccess: 'auth-login-success',
        loginFailed: 'auth-login-failed',
        logoutSuccess: 'auth-logout-success',
        sessionTimeout: 'auth-session-timeout',
        notAuthenticated: 'auth-not-authenticated',
        notAuthorized: 'auth-not-authorized'

    })
    .constant('USER_ROLES', {
        all: '*',
        superAdmin: 'superAdmin',
        normal: 'normal'
    })

    .value('appConf', {
        baseURL: 'http://localhost:3000'
    })