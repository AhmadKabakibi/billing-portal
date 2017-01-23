(function () {
    'use strict';

    angular.module('app')
        .service('POsService', [
            '$http', '$q',
            POsService
        ]);

    function POsService ($http) {

        /*
         $http.get('/someUrl', config).then(successCallback, errorCallback);
         $http.post('/someUrl', data, config).then(successCallback, errorCallback);
         */

        return {
            loadAllItems: function () {
                return $http.get('http://localhost:3000/api/pos');
            },
            loadPOHeader: function (params) {
                if (params.PartnerCode == "allCodes" || params.status == "All") {
                    return $http.post('http://localhost:3000/api/pos', {PONumber: params.PONumber});
                }
                console.log("PONumber: " + params.PONumber + "PartnerCode: " + params.PartnerCode + " : " + params.status)
                return $http.post('http://localhost:3000/api/pos', {
                    PONumber: params.PONumber,
                    PartnerCode: params.PartnerCode,
                    status: params.status
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
            inovicePO: function (params) {
                return $http.put('http://localhost:3000/api/po/inovice', {
                    PONumber: params.PONumber,
                    ActionNote:params.ActionNote
                });
            },
            underReviewPO: function (params) {
                return $http.put('http://localhost:3000/api/po/underreview', {
                    PONumber: params.PONumber
                });
            },
            updatePoLine: function (params) {
                return $http.put('http://localhost:3000/api/poline', {
                    id: params.id,
                    QuantityOrdered: params.QuantityOrdered,
                    QuantityInvoiced: params.QuantityInvoiced,
                    Total: params.Total,
                    PONumber: params.PONumber
                });
            },
            getPartner: function () {
                return $http.get('http://localhost:3000/api/pos/partners')
            },
            receivedFiles: function () {
                return $http.get('http://localhost:3000/api/pos/received')
            },
            exportedFiles: function () {
                return $http.get('http://localhost:3000/api/pos/exported')
            },
            DownloadArchiveFile: function (fileName) {
                return $http.get('http://localhost:3000/api/ftp/' + fileName)
            },
            createInvocie: function (params) {
                return $http.post('http://localhost:3000/api/po/invoice/create', params);
            },
            uploadInvocieFile: function (params) {
                return $http({
                    method: 'POST',
                    url: 'http://localhost:3000/api/po/invoice/' + params.PONumber + '/upload',
                    headers: {'Content-Type': undefined},
                    data: params,
                    transformRequest: function (data, headersGetter) {
                        var formData = new FormData();
                        angular.forEach(data, function (value, key) {
                            formData.append(key, value);
                        });
                        return formData;
                    }
                })

            }
        };
    }
})();
