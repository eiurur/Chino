'use strict';

/* Directives */

angular.module('myApp.directives', [])
  .directive('description', function () {
    return {
      restrict: 'E',
      link: function(scope, element, attrs) {
        var tag;

        tag = (function () {/*
          <div class="col-md-6">
            test
          </div>
        */}).toString().replace(/(\n)/g, '').split('*')[1];

        element.append(tag);
      }
    };
  })
  .directive('signUp', function () {
    return {
      restrict: 'E',
      link: function(scope, element, attrs) {
        var tag;

        tag = (function () {/*
          <div class="col-md-6">
              <h1 class="text-center login-title">Sign up</h1>
              <div class="account-wall">
                  <img class="profile-img" src="https://lh5.googleusercontent.com/-b0-k99FZlyE/AAAAAAAAAAI/AAAAAAAAAAA/eu7opA4byxI/photo.jpg?sz=120"
                      alt="">
                  <form class="form-signin">
                  <input type="text" class="form-control" placeholder="Email" required autofocus>
                  <input type="password" class="form-control" placeholder="Password" required>
                  <button class="btn btn-lg btn-primary btn-block" type="submit">
                      Sign up</button>
                  <label class="checkbox pull-left">
                      <input type="checkbox" value="remember-me">
                      Remember me
                  </label>
                  <a href="#" class="pull-right need-help">Need help? </a><span class="clearfix"></span>
                  </form>
              </div>
              <a href="#" class="text-center new-account">Create an account </a>
          </div>
        */}).toString().replace(/(\n)/g, '').split('*')[1];

        element.append(tag);
      }
    };
  })
  .directive('signIn', function () {
    return {
      restrict: 'E',
      link: function(scope, element, attrs) {
        var tag;

        tag = (function () {/*
          <div class="col-md-6">
              <h1 class="text-center login-title">Sign in</h1>
              <div class="account-wall">
                  <form class="form-signin">
                  <input type="text" class="form-control" placeholder="Email" required autofocus ng-model="signIn.email">
                  <input type="password" class="form-control" placeholder="Password" required ng-model="signIn.password">
                  <button class="btn btn-lg btn-primary btn-block" type="submit" ng-click="signIn(signIn.email, signIn.password)">
                      Sign in</button>
                  <a href="#" class="pull-right need-help">パスワードを忘れた方はこちら </a><span class="clearfix"></span>
                  </form>
              </div>
              <a href="/" class="text-center new-account">Create an account </a>
          </div>
        */}).toString().replace(/(\n)/g, '').split('*')[1];

        element.append(tag);
      }
    }
  })
  .directive('singup', function () {
    return {

    }
  })
  .directive('infomationLogs', function () {
    return {
      restrict: 'E',
      link: function(scope, element, attrs) {
        var tag;

        tag = (function () {/*
          <div class="list-group">
            <a href="#" class="list-group-item active">
              <h4 class="list-group-item-heading">List group item heading</h4>
              <p class="list-group-item-text">Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.</p>
            </a>
            <a href="#" class="list-group-item">
              <h4 class="list-group-item-heading">List group item heading</h4>
              <p class="list-group-item-text">Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.</p>
            </a>
            <a href="#" class="list-group-item">
              <h4 class="list-group-item-heading">List group item heading</h4>
              <p class="list-group-item-text">Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.</p>
            </a>
            <a href="#" class="list-group-item">
              <h4 class="list-group-item-heading">List group item heading</h4>
              <p class="list-group-item-text">Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.</p>
            </a>
            <a href="#" class="list-group-item">
              <h4 class="list-group-item-heading">List group item heading</h4>
              <p class="list-group-item-text">Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.</p>
            </a>
          </div>
        */}).toString().replace(/(\n)/g, '').split('*')[1];

        element.append(tag);
      }
    }
  })
  .directive('passwordMatch', function() {
    return {
      restrict: 'A',
      scope:true,
      require: 'ngModel',
      link: function (scope, elem , attrs,control) {
        var checker = function () {

          var e1 = scope.$eval(attrs.ngModel);

          var e2 = scope.$eval(attrs.passwordMatch);
          return e1 == e2;
        };
        scope.$watch(checker, function (n) {
          control.$setValidity("unique", n);
        });
      }
    };
  })
  .directive('editInfomation', function() {
    return {
      restrict: 'A',
      scope: {
          salesTextLog: '@'
        , detailTextLog: '@'
        , salesText: '='
        , htmlVariable: '='
        // twoWayBind: "=myTwoWayBind",
        // oneWayBind: "&myOneWayBind"
      },
      link: function(scope, element, attrs) {
        var item, srcPhoto, targetPhoto, targetContent;

        element.bind('click', function() {
          var infomationID = element[0].attributes[0].value;
          var infomationIDOnlyNumber = infomationID.replace(/[^\d]/g, '');

          // 置き換え
          scope.salesText = scope.salesTextLog;
          scope.htmlVariable = scope.detailTextLog;
        });
      }
    };
  });
