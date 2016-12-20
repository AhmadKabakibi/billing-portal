(function () {
    angular
        .module('app')
        .controller('InvoiceController', ['navService', 'POsService', '$mdSidenav', '$mdBottomSheet', '$log', '$q', '$state', '$mdToast', 'principal', '$scope', '$rootScope', '$timeout', '$location', 'loginFactory', '$mdEditDialog', '$mdDialog', '$http', 'appConf', '$mdToast', 'Upload', '$timeout',
            InvoiceController
        ]);

    function InvoiceController (navService, POsService, $mdSidenav, $mdBottomSheet, $log, $q, $state, $mdToast, principal, $scope, $rootScope, $timeout, $location, loginFactory, $mdEditDialog, $mdDialog, $http, appConf, $mdToast, Upload, $timeout) {
        var vm = this;


        var last = {
            bottom: false,
            top: true,
            left: false,
            right: true
        };

        $scope.toastPosition = angular.extend({}, last);

        $scope.getToastPosition = function () {
            sanitizePosition();

            return Object.keys($scope.toastPosition)
                .filter(function (pos) {
                    return $scope.toastPosition[pos];
                })
                .join(' ');
        };

        function sanitizePosition () {
            var current = $scope.toastPosition;

            if (current.bottom && last.top) current.top = false;
            if (current.top && last.bottom) current.bottom = false;
            if (current.right && last.left) current.left = false;
            if (current.left && last.right) current.right = false;

            last = angular.extend({}, current);
        }

        $scope.showSimpleStatus = function (status) {
            var pinTo = $scope.getToastPosition();
            $mdToast.show(
                $mdToast.simple()
                    .textContent(status)
                    .position(pinTo)
                    .hideDelay(3000)
            );
        }


        /*
         InvoiceNumber: req.body.InvoiceNumber,
         InvoiceDate: req.body.InvoiceDate,
         PurchaseOrder: req.body.PurchaseOrder,
         ContactEmail: req.body.ContactEmail,
         QuantityInvoiced: req.body.QuantityInvoiced,
         Total: req.body.Total,
         poheaderPONumber: req.body.PONumber,
         podetails:req.body.podetails // array of lines
         CustomerNumber: data.CustomerNumber,
         FreightAmount: data.FreightAmount,
         ItemCode: data.ItemCode,
         Description: data.Description,
         WarehouseCode: data.WarehouseCode,
         PartnerPONumber: data.PartnerPONumber,
         UnitofMeasure: data.UnitofMeasure,
         QuantityOrdered: data.QuantityOrdered,
         QuantityBackordered: data.QuantityBackordered,
         QuantityInvoiced: data.QuantityInvoiced,
         UnitCost: data.UnitCost,
         Total: data.Total,
         poheaderPONumber: data.PONumber
         */

        //alert(($rootScope.currentUser.code).split(";"));

        $scope.invoice = {
            InvoiceNumber: '',
            PartnerCode: $rootScope.currentUser.code,
            InvoiceDate: new Date(),
            PurchaseOrder: $rootScope.POdetails[0].PONumber,
            ContactEmail: '',
            QuantityInvoiced: '',
            Total: '',
            poheaderPONumber: '',
            podetails_invoice: $rootScope.POdetails[0].podetails,
            podetails: []
        };

        $scope.invoicePreview = {
            isDisabled: false,
            isUnderReviewTotal: false,
            isUnderReview: false,
        };

        //Handling charge
        $scope.addHandling = function () {
            $scope.invoicePreview.isUnderReview = true;
            $scope.invoice.podetails.push({
                ItemCode: 'handling',
                Description: 'handling',
                UnitofMeasure: '',
                QuantityOrdered: '1',
                QuantityBackordered: '',
                QuantityInvoiced: '1',
                Total: '',
                poheaderPONumber: $rootScope.POdetails[0].PONumber
            });
        }
        //Freight Charge
        $scope.addFreight = function () {
            $scope.invoicePreview.isUnderReview = true;
            $scope.invoice.podetails.push({
                ItemCode: 'freight',
                Description: 'handling',
                UnitofMeasure: '',
                QuantityOrdered: '1',
                QuantityBackordered: '',
                QuantityInvoiced: '1',
                Total: '',
                poheaderPONumber: $rootScope.POdetails[0].PONumber
            });
        }
        $scope.remove = function (index) {
            $scope.invoice.podetails.splice(index, 1);

            if ($scope.invoice.podetails.length == 0) {
                $scope.invoicePreview.isUnderReview = false;
            }
        }

        $scope.preview = function () {
            $scope.invoicePreview.isDisabled = true;
        }

        $scope.unpreview = function () {
            $scope.invoicePreview.isDisabled = false;
        }

        $scope.UnderReview = function () {
            $scope.invoicePreview.isUnderReviewTotal = true;
        }

        $scope.total = function () {
            var total = 0;
            var total_lines = 0;

            for (var i = 0; i < $scope.invoice.podetails_invoice.length; i++) {
                var line = $scope.invoice.podetails_invoice[i];
                total_lines += parseFloat(line.Total);
            }

            angular.forEach($scope.invoice.podetails, function (item) {
                total += parseFloat(item.Total);
            })
            $scope.invoice.Total = (total + total_lines).toString();
            return parseFloat(total + total_lines).toFixed(2);
        }

        $scope.sendInvoice = function () {
            if ($scope.invoice.Total.length == 0 ) {
                $scope.showSimpleStatus('Invoice Total can not be empty');
            }
            if ($scope.invoice.InvoiceNumber == '') {
                $scope.showSimpleStatus('InvoiceNumber can not be empty');
            } else {

                var lines=$scope.invoice.podetails_invoice;

                for(var i=0;i< lines.length && !$scope.invoicePreview.isUnderReview ; i++){
                    if(lines[i].QuantityOrdered != lines[i].QuantityInvoiced){
                        $scope.invoicePreview.isUnderReview=true;
                    }
                }

                if($scope.invoicePreview.isUnderReviewTotal || $scope.invoicePreview.isUnderReview ) {
                        console.log($rootScope.POdetails[0].PONumber+" is Under Review")

                    POsService.createInvocie($scope.invoice).then(function (response) {
                        if (response.data.success) {
                            POsService.underReviewPO({PONumber: $rootScope.POdetails[0].PONumber})
                                .then(function (response) {
                                    //clear the incovie again and close the window
                                    $scope.invoice = {
                                        InvoiceNumber: '',
                                        PartnerCode: $rootScope.currentUser.code,
                                        InvoiceDate: new Date(),
                                        PurchaseOrder: $rootScope.POdetails[0].PONumber,
                                        ContactEmail: '',
                                        QuantityInvoiced: '',
                                        Total: '',
                                        poheaderPONumber: '',
                                        podetails: $rootScope.POdetails[0].podetails
                                    }

                                    $scope.discard();
                                    $state.go('dashboard');

                                }, function (error) {
                                    $scope.status = 'Unable to inovice a po data: ' + error.message;
                                    $scope.showSimpleStatus($scope.status)
                                    console.log($scope.status);
                                });
                        } else {
                            $scope.showSimpleStatus(response.data.data)
                        }
                    }, function (error) {
                        $scope.status = 'Unable to create an Invocie data: ' + error.message;
                        console.log($scope.status);
                    });

                }
                else{
                    console.log($rootScope.POdetails[0].PONumber+ " Invoiced")

                    POsService.createInvocie($scope.invoice).then(function (response) {
                        if (response.data.success) {
                            POsService.inovicePO({PONumber: $rootScope.POdetails[0].PONumber})
                                .then(function (response) {
                                    //clear the incovie again and close the window
                                    $scope.invoice = {
                                        InvoiceNumber: '',
                                        PartnerCode: $rootScope.currentUser.code,
                                        InvoiceDate: new Date(),
                                        PurchaseOrder: $rootScope.POdetails[0].PONumber,
                                        ContactEmail: '',
                                        QuantityInvoiced: '',
                                        Total: '',
                                        poheaderPONumber: '',
                                        podetails: $rootScope.POdetails[0].podetails
                                    }

                                    $scope.discard();
                                    $state.go('dashboard');

                                }, function (error) {
                                    $scope.status = 'Unable to inovice a po data: ' + error.message;
                                    $scope.showSimpleStatus($scope.status)
                                    console.log($scope.status);
                                });
                        } else {
                            $scope.showSimpleStatus(response.data.data)
                        }
                    }, function (error) {
                        $scope.status = 'Unable to create an Invocie data: ' + error.message;
                        console.log($scope.status);
                    });

                }
            }
        }

        $scope.discard = function () {

            $scope.invoice = {
                InvoiceNumber: '',
                PartnerCode: $rootScope.currentUser.code,
                InvoiceDate: new Date(),
                PurchaseOrder: $rootScope.POdetails[0].PONumber,
                ContactEmail: '',
                QuantityInvoiced: '',
                Total: '',
                poheaderPONumber: '',
                podetails: $rootScope.POdetails[0].podetails
            }

            $mdDialog.hide()
        }

        $scope.date = new Date();

    }
})();
