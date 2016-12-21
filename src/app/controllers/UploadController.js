(function () {
    angular
        .module('app')
        .controller('UploadController', ['$scope', '$rootScope', '$stateParams', 'Upload', '$window', 'POsService',
            UploadController
        ]);

    function UploadController ($scope, $rootScope, $state, $stateParams, Upload, $window, POsService) {
        var vm = this;

        $rootScope.submitFile = function () { //function to call on form submit
            for (var i = 0; i < vm.file.length; i++) {
                //check if from is valid
                $scope.uploadAPI(vm.file[i]);
            }
        }

        $scope.uploadAPI = function (file) {
            POsService.uploadInvocieFile({
                PONumber: $rootScope.POdetails[0].PONumber,
                file: file
            }).then(function (response) {

            }, function (error) {
                $scope.status = 'Unable to create an Invocie data: ' + error.message;
                //$scope.showSimpleStatus($scope.status)
                console.log($scope.status);
            });

        };
    }
})();
