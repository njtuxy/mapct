angular.module('starter')
  .controller('MapController', function ($scope,
                                         $cordovaGeolocation,
                                         $stateParams,
                                         $ionicModal,
                                         $ionicPopup,
                                         LocationsService,
                                         InstructionsService,
                                         GeoFireBaseService) {
    /**
     * Once state loaded, get put map on scope.
     */
    $scope.$on("$stateChangeSuccess", function () {

      $scope.locations = LocationsService.savedLocations;
      $scope.newLocation;

      if (!InstructionsService.instructions.newLocations.seen) {

        var instructionsPopup = $ionicPopup.alert({
          title: 'Add Locations',
          template: InstructionsService.instructions.newLocations.text
        });
        instructionsPopup.then(function (res) {
          InstructionsService.instructions.newLocations.seen = true;
        });

      }

      $scope.map = {
        defaults: {
          tileLayer: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          maxZoom: 18,
          zoomControlPosition: 'bottomleft'
        },
        markers: {},
        events: {
          map: {
            enable: ['context'],
            logic: 'emit'
          }
        }
      };

      $scope.goTo(0);

    });

    var Location = function () {
      if (!(this instanceof Location)) return new Location();
      this.lat = "";
      this.lng = "";
      this.name = "";
    };

    $ionicModal.fromTemplateUrl('templates/addLocation.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.modal = modal;
    });

    /**
     * Detect user long-pressing on map to add new location
     */
    $scope.$on('leafletDirectiveMap.contextmenu', function (event, locationEvent) {
      $scope.newLocation = new Location();
      $scope.newLocation.lat = locationEvent.leafletEvent.latlng.lat;
      $scope.newLocation.lng = locationEvent.leafletEvent.latlng.lng;
      $scope.modal.show();
    });

    $scope.saveLocation = function () {
      LocationsService.savedLocations.push($scope.newLocation);
      $scope.modal.hide();
      $scope.goTo(LocationsService.savedLocations.length - 1);
    };

    /**
     * Center map on specific saved location
     * @param locationKey
     */

    $scope.goToCurrentLocation = function () {
      GeoFireBaseService.getGeoFireData('current_location')
        .then(function (location) {
          $scope.current_location = location;
          $scope.map.center = {
            lat: location[0],
            lng: location[1],
            zoom: 12
          };

          $scope.map.markers[0] = {
            lat: location[0],
            lng: location[1],
            //message: location.name,
            focus: true,
            draggable: false
          };


        })
    };


    $scope.goTo = function (locationKey) {

      var location = LocationsService.savedLocations[locationKey];

      $scope.map.center = {
        lat: location.lat,
        lng: location.lng,
        zoom: 12
      };

      $scope.map.markers[locationKey] = {
        lat: location.lat,
        lng: location.lng,
        //message: location.name,
        message: "<div ng-include src=\"'templates/mapMarkers/marker_popup.html'\"></div>",
        focus: true,
        draggable: false,
        icon: {
          iconUrl: 'img/ping.png',
          //iconSize:     [38, 95], // size of the icon
          iconAnchor: [28, 13], // point of the icon which will
          //type: 'awesomeMarker',
          //icon: 'coffee',
          //markerColor: 'red'
          //markerColor: 'red'
        }
      };


    };

    /**
     * Center map on user's current position
     */
    $scope.locate = function () {
      $cordovaGeolocation
        .getCurrentPosition()
        .then(function (position) {
          $scope.map.center.lat = position.coords.latitude;
          $scope.map.center.lng = position.coords.longitude;
          $scope.map.center.zoom = 15;

          $scope.map.markers.now = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            message: "You Are Here",
            focus: true,
            draggable: false
          };

        }, function (err) {
          // error
        });
    };

    $scope.watchCurrent = function () {
      //geolocation watch example
      var watchOptions = {
        maximumAge: 3000,
        timeout: 3000,
        enableHighAccuracy: false // may cause errors if true
      };

      var watch = $cordovaGeolocation.watchPosition(watchOptions);

      watch.promise.then(
        function () {
          //Do Nothing here!!
        },
        function (err) {
          // error
        },
        function (position) {
          //#Sync the locaiton to firebase
          var lat = position.coords.latitude;
          var lng = position.coords.longitude;

          GeoFireBaseService.insertGeoFireData('current_location', [lat, lng])
            .then(function () {
              //Set the map to current location
              $scope.map.center = {
                lat: lat,
                lng: lng,
                zoom: 16
              };

              $scope.map.markers[0] = {
                lat: lat,
                lng: lng,
                //message: location.name,
                focus: true,
                draggable: false
              };

            })
        }
      );

    };

    $scope.talkToGeoFire = function () {
      GeoFireBaseService.insertGeoFireData('newLocoation', [32, 22])
        .then(function () {
          console.log("insert data!!");
          //Set the map to current location
          $scope.map.center = {
            lat: 20,
            lng: 20,
            zoom: 12
          };

          $scope.map.markers[0] = {
            lat: 20,
            lng: 20,
            //message: location.name,
            focus: true,
            draggable: false
          };

        })
        .catch(function (err) {
          console.log(error);
        })
    };
  })


  .controller('FireBaseAuthController', function ($scope, $rootScope, $state) {
    // Check for the user's authentication state
    $rootScope.fbAuth.$onAuth(function (authData) {
      if (authData) {
        //$rootScope.loggedInUser = authData;
      }
      else {
        $scope.loggedInUser = null;
      }
    });

    // Create a new user, called when a user submits the signup form
    $scope.createUser = function (email, password) {
      $rootScope.fbAuth.$createUser({
        email: email,
        password: password
      }).then(function () {
        // User created successfully, log them in
        return $rootScope.fbAuth.$authWithPassword({
          email: email,
          password: password
        });
      }).then(function (authData) {
        //$rootScope.loggedInUser = authData;
      }).catch(function (error) {
        console.log('Error: ', error);
      });
    };

    // Login an existing user, called when a user submits the login form
    $scope.login = function (email, password) {
      $rootScope.fbAuth.$authWithPassword({
        email: email,
        password: password
      }).then(function (authData) {
        console.log('user logged in!');
        //$rootScope.loggedInUser = authData;
        $state.go("chat")

      }).catch(function (error) {
        console.log('Error: ', error);
      });
    };

    // Log a user out
    $scope.logout = function () {
      $rootScope.fbAuth.$unauth();
    };
  })

  .controller('ChatController', function ($scope, $ionicHistory, $firebaseArray, $rootScope) {
    $ionicHistory.clearHistory();

    var authData = $rootScope.fbAuth.$getAuth();
    if (authData) {
      var messageRef = $rootScope.fb.child("users/" + authData.uid + "/messages");
      messageRef.limitToLast(10).on('child_added', function (snapshot) {
        var data = snapshot.val();
        $scope.chatName = data.name+":"
        $scope.chatText = data.text;
      });
      //var syncArray = $firebaseArray(userReference.child("messages"));
    }


    $scope.sendMessage = function (name, text, uid_of_reciever) {
      var authData = $rootScope.fbAuth.$getAuth();
      if (authData) {
        var userReference = $rootScope.fb.child("users/" + uid_of_reciever);
        var syncArray = $firebaseArray(userReference.child("messages"));
        syncArray.$add({name: name, text: text}).then(function () {
        });
      } else {
      }
    };

    $scope.sendMySelfAMessage = function (name, text) {
      var authData = $rootScope.fbAuth.$getAuth();
      if (authData) {
        var userReference = $rootScope.fb.child("users/" + authData.uid);
        var syncArray = $firebaseArray(userReference.child("messages"));
        syncArray.$add({name: name, text: text}).then(function () {
        });
      } else {
      }
    }
  });

//  .controller('MessageDisplayController', function ($scope, $firebaseArray, $rootScope) {
//    var authData = $rootScope.fbAuth.$getAuth();
//    if (authData) {
//      var messageRef = $rootScope.fb.child("users/" + authData.uid + "/messages");
//      messageRef.limitToLast(10).on('child_added', function(snapshot){
//        var data = snapshot.val();
//        $scope.chatText = snapshot.val().text;
//      });
//      //var syncArray = $firebaseArray(userReference.child("messages"));
//
//
//    }
//  })
//;
