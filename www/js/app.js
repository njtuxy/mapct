// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic',
  'leaflet-directive',
  'ngCordova',
  'igTruncate',
  'angularGeoFire',
  'firebase'])

  .run(function ($ionicPlatform, $rootScope, $firebaseAuth) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        window.cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
      var ref = new Firebase('https://qd.firebaseio.com');
      $rootScope.fb = ref;
      $rootScope.fbAuth = $firebaseAuth(ref);
    });
  })

  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('app', {
        url: "/app",
        abstract: true,
        templateUrl: "templates/menu.html",
        controller: 'MapController'
      })

      .state('app.map', {
        url: "/map",
        views: {
          'menuContent': {
            templateUrl: "templates/map.html"
          }
        }
      })

      .state('login', {
        url: "/login",
        templateUrl: "templates/loginWindow/login.html",
        controller: 'FireBaseAuthController'
      })

      .state('chat', {
        url: "/chat",
        templateUrl: "templates/chat.html",
        controller: 'ChatController'
      })




    $urlRouterProvider.otherwise('/app/map');
    //$urlRouterProvider.otherwise('/login');

  });
