/**
 * Created by yxia on 9/1/15.
 */
angular.module('starter')
  .service('GeoFireBaseService', function ($geofire) {

    var geo = $geofire(new Firebase('https://xygeofire.firebaseio.com'));

    this.insertGeoFireData = function (key, location) {
      return geo.$set(key, location);
    };

    this.getGeoFireData = function (key) {
      return geo.$get(key);
    };
  })
