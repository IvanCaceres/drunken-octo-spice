module.exports = function($scope , uiGmapGoogleMapApi, BusinessTypes, Addresses, Services) {
  $scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 16 },
  $scope.map.stores = {};
  $scope.options = {scrollwheel: false};

  //get our business types
   BusinessTypes.query()
   .$promise.then(function(result){
     console.log(result)
       $scope.businessTypes = result;
   });
  
  //function called when clicking on a store result
  $scope.selectStore = function (store){
    if($scope.map.active){
      $scope.map.active.show = false;
    }
    $scope.map.center = { latitude: store.lat, longitude: store.long };
    $scope.map.zoom = 14;
    store.show = true;
    $scope.map.active = store;
    // $scope.map = { center: { latitude: store.latitude, longitude: store.longitude }, zoom: 8};
  };

  $scope.refreshServices = function(serviceQuery){
    return Services.query(serviceQuery).$promise.then(function(result){
      console.log(result);
      $scope.services = result;
    })
  };

  // uiGmapGoogleMapApi is a promise.
    // The "then" callback function provides the google.maps object.
    uiGmapGoogleMapApi.then(function(maps) {
        console.log('gmap api is loaded!!!')
        console.log(maps)

        //get user device location
        navigator.geolocation.getCurrentPosition(function(position) {
          console.log(position)
          // console.log('setting coordinateString')
            $scope.coordinateString = position.coords.latitude + ', ' + position.coords.longitude;
            $scope.map.center.latitude = position.coords.latitude;
            $scope.map.center.longitude = position.coords.longitude;
          //   console.log($scope.coordinateString)
          //   var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

            //query for stores

            $scope.businessType = $scope.businessType ? $scope.businessType.id : null;
            var formatDate = moment().format("YYYY-MM-DDTHH:mm");
            console.log(typeof($scope.coordinateString))
            console.log(typeof(formatDate))
            console.log(typeof($scope.businessType))
            Addresses.query(5, $scope.coordinateString, formatDate, $scope.businessType)
            .$promise.then(function(result){ 
              console.log('got the businesses!!!')
              console.log(result);
              $scope.map.stores = result;
                for(var i=0;i<result.length;i++){
                  var coords = {
                    latitude: result[i].lat,
                    longitude: result[i].long,
                    title: 'm' + i
                  };
                  $scope.map.stores[i].coords = coords; 
                  $scope.map.stores[i].control = {}; 
                }
                console.log($scope.map.stores);
            });
        });


    });

};