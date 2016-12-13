(function () {
    angular
        .module('app')
        .controller('UploadController', ['$scope', '$rootScope', '$stateParams', 'Upload', '$window',
            UploadController
        ]);

    function UploadController($scope, $rootScope, $state, $stateParams,Upload, $window) {
        var vm = this;
        vm.submit = function () { //function to call on form submit
            if (vm.upload_form.file.$valid && vm.file) { //check if from is valid
                vm.upload(vm.file); //call upload function
            }
        }

        vm.upload = function (file) {
            //ngFileUpload provides an Upload service
            Upload.upload({
                url: 'api/upload', //webAPI exposed to upload the file
                data: {file: file} //pass file as data, should be user ng-model
            }).then(function (resp) { //upload function returns a promise
                $scope.$parent.appendMessage(resp.data.data);
            }, function (resp) { //catch error
            }, function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                vm.progress;// = 'progress: ' + progressPercentage + '% '; // capture upload progress
            });
        };
    }
})();
