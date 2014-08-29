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
      },

      // 分ける？
      signIn: function(email, password) {
          return $http.post('/api/signIn', {email: email, password: password});
      },
      signOut: function() {
          return $http.post('/api/signOut');
      },
      signUp: function(email, password) {
          return $http.post('/api/signUp', {email: email, password: password});
      },

      isAuthenticated: function(email, password) {
          return $http.post('/api/isAuthenticated');
      },

    };

  })
  .service('AuthenticationService', function() {
    var auth = {
        isAuthenticated: false
    }
    return auth;
  });
