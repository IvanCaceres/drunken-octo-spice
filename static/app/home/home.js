'use strict';

var app = angular.module('myApp.home', ['ui.router']);

app.controller('HomeCtrl', ['$scope','BusinessTypes', function($scope,BusinessTypes) {
// alert('test!');
$scope.types = BusinessTypes.query();
$scope.radius = 5;
$scope.types.$then(function(result){
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
    if($scope.data && $scope.data.date){

    User.address = $scope.address;
    User.radius = $scope.radius;
    User.businessType = $scope.businessType;
    User.date = $scope.data.date;
      $state.go('stores');
    } else {
      alert('you must select a date and time')
    }
  }
}
$scope.isSelected = function(section) {
    return $scope.selected === section;
}
$scope.searchSubmit = function (location){
    User.radius = $scope.radius;
    User.businessType = $scope.businessType;
    console.log('DA SCOPE')
    console.log($scope)
    User.date = $scope.data.date;
  if($scope.address){
    User.address = $scope.address;

    $state.go('stores');
  } 
}
}]);

app.controller('StoreMapCtrl', ['$scope','User', 'Addresses', 'Availability', 'Appointments', '$http', 'reverseGeocode' , function($scope, User, Addresses, Availability, Appointments , $http, reverseGeocode) {
console.log(User)


  

  var afterGeocoding = function (){

  var panelDiv = document.getElementById('panel');

  var data = new storeLocator.StaticDataFeed();



  //get stores from server
var getStores = function(){ 
  User.businessType = User.businessType ? User.businessType.id : null;
  var formatDate = moment(User.date).format("YYYY-MM-DDTHH:mm")
  $scope.businesses = Addresses.query(User.radius||5, $scope.coordinateString, formatDate, User.businessType);
 console.log($scope.coordinateString)
 $scope.businesses.$then(function(result){
console.log('got businesses!');
console.log(result)

    var businessIds = [];
    for(var i=0;i<$scope.businesses.length;i++){
      businessIds.push($scope.businesses[i].business_location.id);
    }
    businessIds = businessIds.join();
    console.log(businessIds)
    $scope.availabilities = Availability.query(formatDate, businessIds);
    $scope.availabilities.$then(function(result){
      console.log('RESULT')
      console.log(result)
      var availabilityHTMLObject = function (count,dateTime){
        this.count = count;
        this.date = dateTime;
      };
      availabilityHTMLObject.prototype.bookAppointment = function(business_location,services,when){
        console.log('THIS')
        console.log(this)
        var $this = this;
        var Booking = Appointments.post(business_location,services,when);
        Booking.$then(function(result){
          console.log('completed booking logging result')
          console.log(result)
          $this.count = $this.count-1;
        }, function(error){
          alert(error.data.detail)
        });
        
        console.log(this)
      };
        if(result.data.length > 0){
          for(var i=0;i<$scope.businesses.length;i++){
            for(var y=0;y<result.data.length;y++){
              if($scope.businesses[i].id == result.data[y].store){
              $scope.businesses[i].available = [];
              $scope.businesses[i].available.push(new availabilityHTMLObject(result.data[y].count,formatDate));
              } 
            }
              if(!$scope.businesses[i].available){
                $scope.businesses[i].available = [];
                $scope.businesses[i].available.push(new availabilityHTMLObject($scope.businesses[i].business_location.default_availability,formatDate));
              }
          }
        } else{
          for(var i=0;i<$scope.businesses.length;i++){
            $scope.businesses[i].available = [];
            $scope.businesses[i].available.push(new availabilityHTMLObject($scope.businesses[i].business_location.default_availability,formatDate));
          }
        }
        
    });

$scope.stores = [];
    for(var i=0; i < result.data.length;i++){
      var business = result.data[i];
      console.log('logging business:')
      console.log(business)
      var latLng = new google.maps.LatLng(business.lat, business.long);
      var storeId = business.business_location.slug;
      console.log(storeId)
      var store = new storeLocator.Store(storeId, latLng, null, {
        title: business.business_location.business.business_name + ' - ' + business.business_location.location_name,
        address: business.street + ', ' + business.city + ',' + business.state + ' ' + business.postal_code
      });
      console.log('logging store:')
      console.log(store)
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
      $scope.coordinateString = position.coords.latitude + ', ' + position.coords.longitude;
      console.log($scope.coordinateString)
      var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      var Geocoder = new google.maps.Geocoder;
      Geocoder.geocode({
      latLng: latlng
    }, function(result){
      console.log('reverse geocode was a success');
      $scope.reverseGeocodedResult = result;
      if(result.length >0){
      for(var i =0; i < result.length;i++){
        if(result[i].types[0] == 'neighborhood'){
          var neighborhoodAddress = result[i].formatted_address;
          break;
          } 
        }
        $scope.formattedAddress = neighborhoodAddress || result[0].formatted_address;
      }
    });
        // $scope.geocodedResult = reverseGeocode.query($scope.coordinateString)
        // $scope.geocodedResult.$then(function(result){
        //   console.log('logging reverse geocodedResult')
        //   console.log(result.data)
        // });
    // $http.jsonp('https://maps.googleapis.com/maps/api/geocode/json?latlng='+$scope.coordinateString , {method:'JSONP', params : {callback : 'JSON_CALLBACK'}}).
    // success(function(data, status, headers, config) {
    //     //what do I do here?
    // }).
    // error(function(data, status, headers, config) {
    //     $scope.error = true;
    // });
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
app.controller('authController', ['$scope','api', function($scope, api) {
        // Angular does not detect auto-fill or auto-complete. If the browser
        // autofills "username", Angular will be unaware of this and think
        // the $scope.username is blank. To workaround this we use the 
        // autofill-event polyfill [4][5]
        $('#id_auth_form input').checkAndTriggerAutoFillEvent();
 
        $scope.getCredentials = function(){
          console.log('running getCredentials')
          alert($scope.username)
            alert($scope.password)
            return {username: $scope.username, password: $scope.password};
            
        };
 
        $scope.login = function(){
          console.log('running login function')
            api.auth.login($scope.getCredentials()).
                $then(function(data){
                      console.log(data)
                      console.log('triggered the then signalling data is good')
                        // on good username and password
                        $scope.user = $scope.username;
                        console.log($scope)
                    }).
                    catch(function(data){
                        // on incorrect username and password
                        console.log(data)
                        alert(data.data.detail);
                    });
        };
 
        $scope.logout = function(){
            api.auth.logout(function(){
                $scope.user = undefined;
            });
        };
        $scope.register = function($event){
            // prevent login form from firing
            $event.preventDefault();
            // create user and immediatly login on success
            api.users.create($scope.getCredentials()).
                $then($scope.login).
                    catch(function(data){
                        alert(data.data.username);
                    });
            };
    }]);
 
// [1] https://tools.ietf.org/html/rfc2617
// [2] https://developer.mozilla.org/en-US/docs/Web/API/Window.btoa
// [3] https://docs.djangoproject.com/en/dev/ref/settings/#append-slash
// [4] https://github.com/tbosch/autofill-event
// [5] http://remysharp.com/2010/10/08/what-is-a-polyfill/