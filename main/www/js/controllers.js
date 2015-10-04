angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('MapCtrl', function($scope, $ionicLoading, $http, $timeout, CONFIG, LocalData, Util) {
  $scope.mapCreated = function(map) {
    $scope.map = map;
  };

  var myMarker = new google.maps.Circle({
    strokeColor: '#1E90FF',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#1E90FF',
    fillOpacity: 0.35,
    // map: $scope.map,
    // center: myLatlng,
    radius: 15
  });

  var oppMarker = new google.maps.Circle({
    strokeColor: '#1E9000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#1E9000',
    fillOpacity: 0.35,
    // map: $scope.map,
    // center: oppLatlng,
    radius: 15
  });

  $scope.markers = {
    myMarker : myMarker,
    oppMarker: oppMarker
  }

  // console.log($scope.markers)

  $scope.centerOnMe = function () {
    console.log("Centering");
    if (!$scope.map) {
      console.log("Error");
      return;
    }

    $scope.loading = $ionicLoading.show({
      content: 'Getting current location...',
      showBackdrop: false
    });

    navigator.geolocation.getCurrentPosition(function (pos) {
      console.log('Got pos', pos);
      $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
      $scope.latitude = pos.coords.latitude;
      $scope.longitude = pos.coords.longitude;
      $scope.loading.hide();

      // To add marker to map
      var myLatlng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);

      $scope.markers.myMarker.setCenter(myLatlng);
      $scope.markers.myMarker.setMap($scope.map);
      // console.log($scope.markers)

      var image = LocalData.get().image
      var image = "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xpt1/v/t1.0-1/p32x32/10606606_290540811130250_8444975110426665916_n.jpg?oh=224e2105537d62c4745abee9f4391b78&oe=568B5B71&__gda__=1453335593_bfbc79824a63b8297b59aeb6d914b303"
      var marker = new google.maps.Marker({
        position: myLatlng,
        title: 'Hello World!',
        // map: $scope.map,
        icon: image
      });

      // marker.setMap($scope.map);
    }, function (error) {
      alert('Unable to get location: ' + error.message);
    });
  };

  $scope.updateOpponent = function(oppLatLong){
    $scope.markers.oppMarker.setCenter(oppLatLong);
    $scope.markers.oppMarker.setMap($scope.map);
  }

  function update(){
    var url = CONFIG.URL
    console.log(url)
    $http.get(url)
    .success(function (data, status, headers, config) {
        // console.log(data)
        console.log(data, status, headers, config)

        var myLatlng = new google.maps.LatLng(data.lat, data.lon);

        updateOpponent(myLatlng)

        Util.popUp('Test', 'Updated successfully!');
        // $timeout(update, 2000);
    })
    .error(function (data, status, headers, config) {
        // console.log(data, status, headers, config)
        Util.popUp('Test', 'Request unsuccessful');
    })
    // $timeout(update, 5000);
  };

  update();


})

.controller('CameraCtrl', 
  function($scope, $ionicPlatform, $cordovaCamera, $http, $ionicPopup, GameData2, GameData3) {
  console.log("Reporting from camera controller");
  document.addEventListener("deviceready", function () {
    console.log("deviceready");
    var options = {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 400,
      targetHeight: 600,
      cameraDirection: 0,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false,
      correctOrientation:true
    };

    $scope.getPhoto = function(){
      $cordovaCamera.getPicture(options).then(function(imageData) {
        var image = document.getElementById('myImage');
        image.src = "data:image/jpeg;base64," + imageData;
        console.log(image.src)
      }, function(err) {
        // error
      });
    };

    $scope.getPhoto();

  }, false);

  // An alert dialog
   $scope.showAlert = function(message) {
     var alertPopup = $ionicPopup.alert({
       title: 'Don\'t eat that!',
       template: message
     });
     alertPopup.then(function(res) {
       console.log('Thank you for not eating my delicious ice cream cone');
     });
   };


  $scope.sendPhoto = function(){
    var url = "http://192.168.12.79:8000"
    var image = document.getElementById('myImage');
    console.log(image);
    var data = GameData3.get();
    data.img = image.src;
    data = "data=" +  JSON.stringify(data);
    console.log(data);
    $http.post(url, data, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
    })
    .success(function (data, status, headers, config) {
        // console.log(data)
        console.log(data, status, headers, config)
        $scope.message = 'Created successfully!';
        $scope.showAlert('Created successfully!');
    })
    .error(function (data, status, headers, config) {
        console.log(data, status, headers, config)
        $scope.showAlert('Request unsuccessful');
    })
  }
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
