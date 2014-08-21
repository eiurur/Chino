'use strict';

angular.module('myApp', [
  'ngRoute',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers',
  'summernote'
]).
config(function ($routeProvider, $locationProvider) {
  $routeProvider.
    when('/', {
      templateUrl: 'partials/index',
      controller: 'MyCtrl'
    }).
    when('/signup', {
      templateUrl: 'partials/signup',
      controller: 'SignUpCtrl'
    }).
    when('/signin', {
      templateUrl: 'partials/signin',
      controller: 'SignInCtrl'
    }).
    when('/init', {
      templateUrl: 'partials/init',
      controller: 'InitCtrl'
    }).
    otherwise({
      redirectTo: '/'
    });

  $locationProvider.html5Mode(true);
});
