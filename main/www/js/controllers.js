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

.controller('MapCtrl', function() {
  console.log("Reporting from map controller");
})

.controller('CameraCtrl', function($scope, $ionicPlatform, $cordovaCamera, $http, GameData2, GameData3) {
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
        $scope.message = 'Created successfully!';
    })
    .error(function (data, status, headers, config) {
        // console.log(data)
        $scope.message = 'Created successfully!';
    })
  }
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
