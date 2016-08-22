(function(){
    'use strict';

    angular.module('app')
        .service('POsService', [
            '$http','$q',
            POsService
        ]);

    function POsService($http){

        return {
            loadAllItems : function() {
                return $http.get('http://localhost:3000/api/pos');
            }
        };
    }
})();
