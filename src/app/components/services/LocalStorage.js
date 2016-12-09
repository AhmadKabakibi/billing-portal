(function () {
    'use strict';

    angular.module('app')
        .service('LocalStorage', [
            '$http',
            LocalStorage
        ]);

    function LocalStorage($http) {
        return {
            hasInvoice: function () {
                return !(localStorage['invoice'] == '' || localStorage['invoice'] == null);
            },
            getInvoice: function () {
                if (this.hasInvoice()) {
                    return JSON.parse(localStorage['invoice']);
                } else {
                    return false;
                }
            },
            setInvoice: function (invoice) {
                localStorage['invoice'] = JSON.stringify(invoice);
            },
            clearinvoice: function () {
                localStorage['invoice'] = '';
            },
            clear: function () {
                localStorage['invoice'] = '';
            }
        };
    }
})();
