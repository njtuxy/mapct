/**
 * Created by yxia on 9/1/15.
 */
angular.module('starter')
  .service('FirebaseAccountService', function ($firebaseAuth) {

    var fireBaseAuth = $firebaseAuth(new Firebase('https://qd.firebaseio.com'));

    //account should be an object, exampe: {'email': 'a@a.com',  'password': 'a'}

    this.loginWithFireBase = function (account) {
      return fireBaseAuth.$authWithPassword(account);
    };

    this.singUpWithFireBase = function (account) {
      return fireBaseAuth.$createUser(account).then(function () {
        return fireBaseAuth.$authWithPassword(account);
      })
    };

  });
