/**
 * Created by a.kabakibi on 12/5/2016.
 */
(function () {
    'use strict';

    angular.module('app')
        .service('Currency', [
            Currency
        ]);

    function Currency() {
        return {
            all : function() {
            return [
                {
                    name: 'British Pound (£)',
                    symbol: '£'
                },
                {
                    name: 'Canadian Dollar ($)',
                    symbol: 'CAD $ '
                },
                {
                    name: 'Euro (€)',
                    symbol: '€'
                },
                {
                    name: 'Indian Rupee (₹)',
                    symbol: '₹'
                },
                {
                    name: 'Norwegian krone (kr)',
                    symbol: 'kr '
                },
                {
                    name: 'US Dollar ($)',
                    symbol: '$'
                }
            ]
        }
        };
    }
})();
