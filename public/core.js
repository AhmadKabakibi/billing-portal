var App = angular.module('portal', ['ui.router','ui.grid']);
/**
 * Configure the Routes
 */
App.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('export', {
            url: '/',
            templateUrl: 'public/view/main_grid.html',
            controller: 'exportCtrl',
            reload: false
        })

}]);
