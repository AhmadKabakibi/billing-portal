App.controller('exportCtrl', function ($scope,$http,poinfo) {
    'use strict';


    poinfo.all().then(function (POInfo) {
        console.log(JSON.stringify(POInfo));
        $scope.POs = POInfo;
    });


    $scope.gridOptions = {
        data: 'POs',

        columnDefs: [
                     {field:'PONumber', displayName:'PONumber',minWidth:150}, {field:'PODate', displayName:'PODate',minWidth:150},
                     {field:'OrderType', displayName:'OrderType',minWidth:150},{field:'Division', displayName:'Division',minWidth:150},
                     {field:'PartnerCode', displayName:'PartnerCode',minWidth:150},{field:'PartnerName', displayName:'PartnerName',minWidth:150},
                     {field:'ShipToCode', displayName:'ShipToCode',minWidth:150},{field:'ShipToName', displayName:'ShipToName',minWidth:150},
                     {field:'POERPStatus', displayName:'POERPStatus',minWidth:150}, {field:'CustomerNumber', displayName:'CustomerNumber',minWidth:150},
                     {field:'FreightAmount', displayName:'FreightAmount',minWidth:150}, {field:'ItemCode', displayName:'ItemCode',minWidth:150},
                     {field:'Description', displayName:'Description',minWidth:150},{field:'WarehouseCode', displayName:'WarehouseCode',minWidth:150},
                     {field:'PartnerPONumber', displayName:'PartnerPONumber',minWidth:150},{field:'UnitofMeasure', displayName:'UnitofMeasure',minWidth:150},
                     {field:'QuantityOrdered', displayName:'QuantityOrdered',minWidth:150}, {field:'Quantitybackordered', displayName:'Quantitybackordered',minWidth:150},
                     {field:'Quantityinvoiced', displayName:'Quantityinvoiced',minWidth:150},{field:'UnitCost', displayName:'UnitCost',minWidth:150},
                     {field:'Total', displayName:'Total'}
        ],
        enableColumnResize:true,
        enableSorting:false,

    };

});