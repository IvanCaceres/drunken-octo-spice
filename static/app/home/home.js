'use strict';

var app = angular.module('myApp.home', ['ui.router']);

app.controller('HomeCtrl', ['$scope','BusinessTypes', function($scope,BusinessTypes) {
// alert('test!');
$scope.types = BusinessTypes.query();
$scope.radius = 5;
$scope.types.$promise.then(function(result){
  console.log(result)
});
$scope.selectSearchType = function (){
	alert('dis b !');
}


}]);

app.controller('SearchCtrl', ['$scope', '$state', 'User', function($scope,$state,User) {
// alert('test!');
$scope.searchTypes = [
	{name: 'Detect Location'},
	{name: 'Enter Address'}];
$scope.setSelected = function (searchType){
	// alert('dis b !');
	$scope.selected = searchType;
  if(searchType == 'Detect Location'){
    User.address = $scope.address;
    User.radius = $scope.radius;
    User.businessType = $scope.businessType;
      $state.go('stores');
  }
}
$scope.isSelected = function(section) {
    return $scope.selected === section;
}
$scope.searchSubmit = function (location){
  if($scope.address){
    User.address = $scope.address;
    User.radius = $scope.radius;
    User.businessType = $scope.businessType;
    $state.go('stores');
  } 
}
}]);

app.controller('StoreMapCtrl', ['$scope','User', 'Addresses', function($scope, User, Addresses) {
console.log(User)
var setup = function (addressBool){
if(addressBool === true){

} else {

}
}

  var afterGeocoding = function (){

  var panelDiv = document.getElementById('panel');

  var data = new storeLocator.StaticDataFeed();



  //get stores from server
var getStores = function(){ 
  User.businessType = User.businessType ? User.businessType.id : null;
  $scope.businesses = Addresses.query(User.radius||5, $scope.coordinateString, User.businessType);
 console.log($scope.coordinateString)
 $scope.businesses.$promise.then(function(result){
console.log('got businesses!');
console.log(result)

$scope.stores = [];
    for(var i=0; i < result.length;i++){
      var business = result[i];
      var latLng = new google.maps.LatLng(business.lat, business.long);
      var storeId = business.business_location.slug;
      console.log(storeId)
      var store = new storeLocator.Store(storeId, latLng, null, {
        title: business.business_location.business.business_name + ' - ' + business.business_location.location_name,
        address: business.street + ', ' + business.city + ',' + business.state + ' ' + business.postal_code

      });
      $scope.stores.push(store);
      view.createMarker(store);
    }
    data.setStores($scope.stores)
    console.log(data)
    view.refreshView();
 }); 
}
if(User.address){
    var view = new storeLocator.View($scope.map, data, {geolocation: false});
    getStores();
  } else {
    var view = new storeLocator.View($scope.map, data);
    console.log(view)
    console.log('logged the view')
    navigator.geolocation.getCurrentPosition(function(position) {
      // var pos = new google.maps.LatLng(position.coords.latitude,
      //                                  position.coords.longitude);
    console.log(position)
      $scope.coordinateString = position.coords.latitude + ',' + position.coords.longitude;
      console.log($scope.coordinateString)
      getStores();
    });
  }
 // console.log('logging parseStores')
 // console.log(parseStores)
 //  var stores = parseStores(json);
 //  data.setStores(stores);

  
  

  var markerSize = new google.maps.Size(24, 24);
  // view.createMarker = function(store) {
  //   return new google.maps.Marker({
  //     position: store.getLocation(),
  //     icon: new google.maps.MarkerImage(store.getDetails().icon, null, null,
  //         null, markerSize)
  //   });
  // };

  new storeLocator.Panel(panelDiv, {
    view: view
  });
// });

/**
 * Creates a new PlacesDataSource.
 * @param {google.maps.Map} map
 * @constructor
 */
function PlacesDataSource(map) {
  this.service_ = new google.maps.places.PlacesService($scope.map);
}

/**
 * @inheritDoc
 */
// PlacesDataSource.prototype.getStores = function(bounds, features, callback) {
//   alert('this being called!!')
//   this.service_.search({
//     bounds: bounds
//   }, function(results, status) {
//     var stores = [];

//     for (var i = 0, result; result = results[i]; i++) {
//       var latLng = result.geometry.location;
//       var store = new storeLocator.Store(result.id, latLng, null, {
//         title: result.name,
//         address: result.types.join(', '),
//         icon: result.icon
//       });
//       stores.push(store);
//     }

//     callback(stores);
//   });
// };
}

if(User.address){
    var Geocoder = new google.maps.Geocoder;
    console.log(Geocoder)
    Geocoder.geocode({
      address: User.address
    }, function(result){
      console.log('it was a success');
      $scope.geocodedResult = result;
      console.log('logging geocded')
    console.log($scope.geocodedResult[0])
  $scope.map = new google.maps.Map(document.getElementById('map-canvas'), {
    center: new google.maps.LatLng($scope.geocodedResult[0].geometry.location.k, $scope.geocodedResult[0].geometry.location.B),
    zoom: 12,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });
  $scope.coordinateString = $scope.geocodedResult[0].geometry.location.k+','+$scope.geocodedResult[0].geometry.location.B;
  afterGeocoding();
    });
   } else {
    $scope.map = new google.maps.Map(document.getElementById('map-canvas'), {
    // center: new google.maps.LatLng(40.776175, -73.958439),
    zoom: 6,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });
  afterGeocoding();
   }
// A simple demo showing how to grab places using the Maps API Places Library.
// Useful extensions may include using "name" filtering or "keyword" search.

// google.maps.event.addDomListener(window, 'load', function() {

}]);