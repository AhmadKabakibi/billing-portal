(function () {
    'use strict';

    angular.module('app', ['ngMaterial', 'md.data.table','ngResource','ngFileUpload'])

        .config(['$compileProvider', '$mdThemingProvider', function ($compileProvider, $mdThemingProvider) {
            'use strict';

            $compileProvider.debugInfoEnabled(false);

            $mdThemingProvider.theme('default')
                .primaryPalette('blue')
                .accentPalette('pink');
        }]);

})();
