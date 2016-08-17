(function(){
  'use strict';

  angular.module('app')
          .service('navService', [
          '$q',
          navService
  ]);

  function navService($q){
    var menuItems = [
      {
        name: 'My POs',
        icon: 'assignment',
        sref: '.dashboard'
      },
      {
        name: 'Received',
        icon: 'import_export',
        sref: '.profile'
      },
      {
        name: 'Exported',
        icon: 'unarchive',
        sref: '.table'
      },
      {
        name: 'Setup',
        icon: 'settings',
        sref: '.dashboard'
      }
    ];

    return {
      loadAllItems : function() {
        return $q.when(menuItems);
      }
    };
  }

})();
