'use strict';

/* Services */

angular.module('myApp.services', [])
  .service('ClientService', function($http) {

    return {

      init: function() {
        return $http.get('/api/init/');
      },

      findStoreInfo: function(UUID) {
        return $http.get('/api/findStoreInfo/' + UUID);
      },

      findStoreDetail: function(UUID) {
        return $http.get('/api/findStoreDetail/' + UUID);
      },

      notifyActiveCustomer: function(UUID, deviceID) {
        return $http.get('/api/notifyActiveCustomer/' + UUID + '/' + deviceID);
      },

      getActiveCustomerCount: function(UUID) {
        return $http.get('/api/getActiveCustomerCount/' + UUID);
      },

      clearActives: function() {
        return $http.get('/api/clearActives');
      }

    };

  });