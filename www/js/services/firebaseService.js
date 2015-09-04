/**
 * Created by yxia on 9/1/15.
 */
angular.module('starter')
  .constant('firebaseURL', 'https://qd.firebaseio.com')

  .factory('fbAuthService', function ($firebaseAuth, firebaseURL) {
    var ref = new Firebase(firebaseURL);
    return $firebaseAuth(ref);
  });
