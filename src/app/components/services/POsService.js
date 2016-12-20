(function () {
    'use strict';

    angular.module('app')
        .service('POsService', [
            '$http', '$q',
            POsService
        ]);

    function POsService($http) {

        /*
         $http.get('/someUrl', config).then(successCallback, errorCallback);
         $http.post('/someUrl', data, config).then(successCallback, errorCallback);
         */

        return {
            loadAllItems: function () {
                return $http.get('http://localhost:3000/api/pos');
            },
            loadPOHeader: function (params) {
                if (params.PartnerCode == "allCodes" || params.status=="All") {
                    return $http.post('http://localhost:3000/api/pos', {PONumber: params.PONumber});
                }
                console.log("PONumber: " + params.PONumber + "PartnerCode: " + params.PartnerCode +" : " +params.status)
                return $http.post('http://localhost:3000/api/pos', {
                    PONumber: params.PONumber,
                    PartnerCode: params.PartnerCode,
                    status:params.status
                });
            },
            getPOs: function (params) {
                return $http.post('http://localhost:3000/api/po/' + params.PONumber, {dateRange: params.dateRange});
            },
            acceptPO: function (params) {
                return $http.put('http://localhost:3000/api/po/accept', {POList: params});
            },
            rejectePO: function (params) {
                return $http.put('http://localhost:3000/api/po/reject', {
                    PONumber: params.PONumber,
                    comment: params.comment
                });
            },
            inovicePO:function(params){
                return $http.put('http://localhost:3000/api/po/inovice', {
                    PONumber: params.PONumber
                });
            },
           underReviewPO:function(params){
                return $http.put('http://localhost:3000/api/po/underreview', {
                    PONumber: params.PONumber
                });
            },
            getPartner: function () {
                return $http.get('http://localhost:3000/api/pos/partners')
            },
            receivedFiles: function () {
                return $http.get('http://localhost:3000/api/pos/received')
            },
            DownloadArchiveFile: function (fileName) {
                return $http.get('http://localhost:3000/api/ftp/' + fileName)
            },
            createInvocie: function (params) {
                return $http.post('http://localhost:3000/api/po/invoice/create', params);
            }
        };
    }
})();
