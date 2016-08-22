'use strict';

angular.module('angularMaterialAdmin', ['ngAnimate', 'ngCookies', 'ngTouch',
        'ngSanitize', 'ui.router', 'ngMaterial', 'nvd3', 'app'])

    .config(function ($stateProvider, $urlRouterProvider, $mdThemingProvider,
                      $mdIconProvider) {
        $stateProvider
            .state('home', {
                url: '',
                templateUrl: 'app/views/main.html',
                controller: 'MainController',
                controllerAs: 'vm',
                abstract: true
            })
            .state('home.dashboard', {
                url: '/dashboard',
                templateUrl: 'app/views/dashboard.html',
                controller: 'POsController',
                controllerAs: 'vm',
                data: {
                    title: 'Dashboard'
                }
            })
            .state('home.settings', {
                url: '/settings',
                templateUrl: 'app/views/settings.html',
                controller: 'SettingsController',
                controllerAs: 'vm',
                data: {
                    title: 'settings'
                }
            })
            .state('home.exported', {
                url: '/exported',
                controller: 'POsController',
                templateUrl: 'app/views/exported.html',
                data: {
                    title: 'exported'
                }
            })

            .state('home.received', {
                url: '/received',
                controller: 'POsController',
                templateUrl: 'app/views/received.html',
                data: {
                    title: 'received'
                }
            });

        $urlRouterProvider.otherwise('/dashboard')
        /*        $stateProvider
         .state('login', {
         url: '/login',
         data: {
         roles: []
         },
         views: {
         'content@': {
         templateUrl: 'app/views/login.html',
         controller: "LoginController"
         }
         }
         })
         .state('home', {
         url: '/',
         data: {
         roles: ['User']
         },
         views: {
         'content@': {
         templateUrl: 'app/views/main.html',
         controller: 'MainController',
         controllerAs: 'vm'
         }
         },
         'abstract': true,
         resolve: {
         authorize: ['authorization',
         function (authorization) {
         return authorization.authorize();
         }
         ]
         }
         })
         .state('home.restricted', {
         url: '/restricted',
         data: {
         roles: ['admin']
         },
         views: {
         'content@': {
         templateUrl: 'app/views/restricted.html'
         }
         }
         }).state('home.accessdenied', {
         url: '/denied',
         data: {
         roles: []
         },
         views: {
         'content@': {
         templateUrl: 'app/views/denied.html'
         }
         }
         })
         .state('home.dashboard', {
         url: '/dashboard',
         data: {
         roles: ['User']
         },
         views: {
         'content@': {
         templateUrl: 'app/views/dashboard.html',
         controller: 'MainController',
         controllerAs: 'vm'
         }
         }
         })
         .state('home.profile', {
         url: '/profile',
         data: {
         roles: ['User']
         },
         views: {
         'content@': {
         templateUrl: 'app/views/settings.html',
         controller: 'ProfileController',
         controllerAs: 'vm'
         }
         }
         })
         .state('home.table', {
         url: '/table',
         data: {
         roles: ['User']
         },
         views: {
         'content@': {
         templateUrl: 'app/views/exported.html',
         controller: 'TableController',
         controllerAs: 'vm'
         }
         }
         })
         // Send to login if the URL was not found
         $urlRouterProvider.otherwise("/");*/

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
    .run(['$rootScope', '$state', '$stateParams', 'authorization', 'principal',
        function ($rootScope, $state, $stateParams, authorization, principal) {
            $rootScope.$on('$stateChangeStart', function (event, toState, toStateParams) {
                $rootScope.toState = toState;
                $rootScope.toStateParams = toStateParams;

                if (principal.isIdentityResolved()) authorization.authorize();
            });
        }
    ]);