'use strict';

/* Services */

angular.module('myApp.services', [])
  .service('ClientService', function($http) {

    return {

      init: function() {
        return $http.get('/api/init/');
      },

      findStoreInfo: function(UUID) {
        var UUID = UUID || 'b0fc4601-14a6-43a1-abcd-cb9cfddb4013'
        return $http.get('/api/findStoreInfo/' + UUID);
      }
    };

    // this.random = function() {
    //   return this.items[Math.floor(Math.random() * this.items.length)];
    // }
  });
