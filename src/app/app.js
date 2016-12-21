(function () {
    'use strict';

    angular.module('app', ['ngMaterial', 'md.data.table','ngResource','ngJsonExportExcel','ng-currency'])

        .config(['$compileProvider', '$mdThemingProvider', function ($compileProvider, $mdThemingProvider) {
            'use strict';

            $compileProvider.debugInfoEnabled(false);

            $mdThemingProvider.theme('default')
                .primaryPalette('blue')
                .accentPalette('pink');
        }]);

})();
