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
  .directive('signIn', function () {
    return {
      restrict: 'E',
      link: function(scope, element, attrs) {
        var tag;

        tag = (function () {/*
          <div class="col-md-6">
              <h1 class="text-center login-title">Sign in</h1>
              <div class="account-wall">
                  <img class="profile-img" src="https://lh5.googleusercontent.com/-b0-k99FZlyE/AAAAAAAAAAI/AAAAAAAAAAA/eu7opA4byxI/photo.jpg?sz=120"
                      alt="">
                  <form class="form-signin">
                  <input type="text" class="form-control" placeholder="Email" required autofocus>
                  <input type="password" class="form-control" placeholder="Password" required>
                  <button class="btn btn-lg btn-primary btn-block" type="submit">
                      Sign in</button>
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
  .directive('signUp', function () {
    return {
      restrict: 'E',
      link: function(scope, element, attrs) {
        var tag;

        tag = (function () {/*
          <div class="col-md-6">
              <h1 class="text-center login-title">Sign up</h1>
              <div class="account-wall">
                  <form class="form-signin">
                  <input type="text" class="form-control" placeholder="Email" required autofocus>
                  <input type="password" class="form-control" placeholder="Password" required>
                  <button class="btn btn-lg btn-primary btn-block" type="submit">
                      Sign up</button>
                  <a href="#" class="pull-right need-help">パスワードを忘れた方はこちら </a><span class="clearfix"></span>
                  </form>
              </div>
              <a href="#" class="text-center new-account">Create an account </a>
          </div>
        */}).toString().replace(/(\n)/g, '').split('*')[1];

        element.append(tag);
      }
    }
  })
  .directive('singup', function () {
    return {

    }
  });
