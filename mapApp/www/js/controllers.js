angular.module('starter.controllers', [])

.controller('MapCtrl', function($scope, $ionicLoading) {
  $scope.mapCreated = function(map) {
    $scope.map = map;
  };

  $scope.centerOnMe = function () {
    console.log("Centering");
    if (!$scope.map) {
      console.log("Error");
      return;
    }
    else
    {
      console.log("Success");
    }

    $scope.loading = $ionicLoading.show({
      content: 'Getting current location...',
      showBackdrop: false
    });

    navigator.geolocation.getCurrentPosition(function (pos) {
      console.log('Got pos', pos);
      $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
      console.log("The current position is " ,  pos.coords.latitude , pos.coords.longitude);
      $scope.loading.hide();

      // To add marker to map
      var myLatlng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);

      var marker = new google.maps.Marker({
        position: myLatlng,
        map: $scope.map,
        title: 'Hello World!'
      });

      // marker.setMap($scope.map);
    }, function (error) {
      alert('Unable to get location: ' + error.message);
    });
  };
});
