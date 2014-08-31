'use strict';

angular.module('myApp', [
  'ngRoute',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers',
  'textAngular',
  'ui.bootstrap'
]).
config(function ($routeProvider, $locationProvider) {
  $routeProvider.
    when('/', {
      templateUrl: 'partials/index',
      controller: 'UserCtrl',
      requiresLogin: true
    }).
    when('/signup', {
      templateUrl: 'partials/signup',
      controller: 'AdminUserCtrl',
      requiresLogin: false
    }).
    when('/signin', {
      templateUrl: 'partials/signin',
      controller: 'AdminUserCtrl',
      requiresLogin: false
    }).
    when('/signout', {
      templateUrl: 'partials/signout',
      controller: 'AdminUserCtrl',
      requiresLogin: true
    }).
    when('/user', {
      templateUrl: 'partials/user',
      controller: 'AdminUserCtrl',
      requiresLogin: true
    }).
    when('/init', {
      templateUrl: 'partials/init',
      controller: 'InitCtrl',
      requiresLogin: false
    }).
    otherwise({
      redirectTo: '/'
    });

  $locationProvider.html5Mode(true);
})
.run(function($rootScope, $location, $window, AuthenticationService) {
  $rootScope.$on("$routeChangeStart", function(event, currentRoute, nextRoute) {
    //redirect only if both isAuthenticated is false and no token is set
    console.log("app AuthenticationService.isAuthenticated = " + AuthenticationService.isAuthenticated);
    // console.log("nextRoute.$$route ",  nextRoute.$$route);
    // console.log("nextRoute.requiresLogin " + nextRoute.requiresLogin);
    // console.log("nextRoute.$$route.requiresLogin " + nextRoute.$$route.requiresLogin);
    console.log("currentRoute.requiresLogin " + currentRoute.requiresLogin);
    console.log("nextRoute ", nextRoute);
    // console.log("nextRoute.$$route ", nextRoute.$$route);

    if (currentRoute.requiresLogin && nextRoute && nextRoute.$$route.requiresLogin !== false) {
      if (!AuthenticationService.isAuthenticated) {
        console.log("app 中 AuthenticationService.isAuthenticated = " + AuthenticationService.isAuthenticated);
        console.log("app.js (^^ゞ) ---> /signin");
        $location.path("/signin");
      }
    }
  });
});