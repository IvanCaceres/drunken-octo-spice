(function () {

  'use strict';
  window.$ = window.jQuery = require('jquery');
  require('bootstrap');
  require('angular');
  require('angular-ui-router');
  require('angular-resource');
  window._ = require('lodash');
  require('./angular-google-maps.min');
  require('./ui-select.min');
  require('./services/services');
  var authCtrl = require('./controllers/auth/authCtrl');
  var loginModalCtrl = require('./controllers/auth/loginModalCtrl');
  var profileCtrl = require('./controllers/user/profileCtrl');
  var storeDetailCtrl = require('./controllers/stores/detail');
  window.moment = require('moment');
  require('./datetimepicker');
  require('./vendor/ui-bootstrap-tpls-0.12.1.min');
  require('bootstrap-switch');
  require('angular-bootstrap-switch');
  angular.module('AppointmentBookingApp', [
    'ui.router',
    'uiGmapgoogle-maps',
    'AppServices',
    'ui.select',
    'ui.bootstrap',
    'ui.bootstrap.datetimepicker',
    'frapontillo.bootstrap-switch'
    ])

  .config([
    '$locationProvider',
    '$stateProvider',
    '$urlRouterProvider',
    '$resourceProvider',
    '$httpProvider',
    'uiGmapGoogleMapApiProvider',
    'USER_ROLES',
    function($locationProvider, $stateProvider, $urlRouterProvider, $resourceProvider, $httpProvider, uiGmapGoogleMapApiProvider, USER_ROLES) {
      $locationProvider.html5Mode(true);

      //set csrf cookie options
      $httpProvider.defaults.xsrfCookieName = 'csrftoken';
      $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';  

      // routes
      $stateProvider
        .state("home", {
          url: "/",
          templateUrl: "static/js/templates/home.html",
          controller: "MainController",
          data: {
            authorizedRoles: [USER_ROLES.all, USER_ROLES.guest, USER_ROLES.admin, USER_ROLES.editor]
          } 
        })
        .state("home.storeDetail", {
            url: ":id/",
            templateUrl: 'static/js/templates/stores/detail.html',
            controller: "StoreDetailController",
            data: {
              authorizedRoles: [USER_ROLES.all, USER_ROLES.guest, USER_ROLES.admin, USER_ROLES.editor]
            }
        })
        .state('profile', {
          url: "/profile/",
          templateUrl: "static/js/templates/user/profile.html",
          controller: 'ProfileCtrl',
          data: {
            authorizedRoles: [USER_ROLES.admin, USER_ROLES.editor, USER_ROLES.all]
          } 
        });
      $urlRouterProvider.otherwise("/");
      $resourceProvider.defaults.stripTrailingSlashes = false;
      uiGmapGoogleMapApiProvider.configure({
        //    key: 'your api key',
        v: '3.17',
        libraries: 'weather,geometry,visualization'
      });
    }
  ])
  
  .filter('slugify', function() {
     return function (input) {
      if (input) {
        return input.toLowerCase().replace(/[^a-z_]/g, '-');
      }
    };
  })

  .run(function ($rootScope, AUTH_EVENTS, AuthService, Session, USER_ROLES, User) {
    console.log('logging User')
    console.log(User)
    if($rootScope.user){
      alert('asdasdzxczxczxczxczxczxc')
    }
      console.log(USER_ROLES)
        Session.create('default','guest',USER_ROLES.guest)
          console.log(Session)
      $rootScope.$on('$stateChangeStart', function (event, next) {
        var authorizedRoles = next.data.authorizedRoles;
        if (!AuthService.isAuthorized(authorizedRoles)) {
          event.preventDefault();
          if (AuthService.isAuthenticated()) {

            // user is not allowed
            $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
          } else {
            // user is not logged in
            $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
          }
        }
      });
  })

  //Load controller
  .controller('MainController', ['$scope','uiGmapGoogleMapApi','uiGmapIsReady','BusinessTypes','Addresses','Services','Session','UserCarsService','UserCars', function($scope, uiGmapGoogleMapApi, uiGmapIsReady, BusinessTypes, Addresses,Services,Session,UserCarsService,UserCars) { 
       $scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 14, stores:[]},
       $scope.radiusDistance = 5;
       $scope.showEnterAddress = false;
  $scope.map.rebuild = null;
  $scope.options = {scrollwheel: false};
  $scope.selectedService = null;
  //get our business types
   BusinessTypes.query()
   .$promise.then(function(result){
     console.log(result)
       $scope.businessTypes = result;
   });
  if(Session.userId != 'guest'){
    if(!UserCarsService.data){
      UserCars.query(Session.userId)
      .$promise.then(function(result){
        console.log('after getting cars dump result',result);
        UserCarsService.update(result);
        $scope.usercars = result;
      });
    } else {
      $scope.usercars = UserCarsService.data;
    }
  }
  
  $scope.session = Session;
  console.log('alright lets dump scope', $scope);

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

  $scope.storeSearch = function(){
    //set the business type
    console.log('dump scope before storesearch')
      console.log($scope)
    var businessTypeId = $scope.businessType ? $scope.businessType.id : null;   

    if($scope.userCustomAddress){
      console.log('found a custom address')
      console.log($scope.userCustomAddress)
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode( { 'address': $scope.userCustomAddress}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          console.log('this is the geocoded:')
          console.log(results[0].geometry.location)
          console.log(results[0].geometry.location.toString())
          console.log(results[0].geometry.location.lat())
          $scope.map.center = {latitude: results[0].geometry.location.lat(), longitude: results[0].geometry.location.lng()};
          $scope.coordinateString = results[0].geometry.location.lat() + ', ' + results[0].geometry.location.lng();
          runSearch();
        } else {
          alert('Geocode was not successful for the following reason: ' + status);
        }
      });  

    } else {
      console.log('there is no addrzxczxczess entered')
      runSearch();
    }

    function runSearch(){
      //run the search
      var serviceId = $scope.serviceSelected ? $scope.serviceSelected.id : null;

      var car = $scope.selectedUserCar ? $scope.selectedUserCar.model.id : null;
      
      Addresses.query($scope.radiusDistance, $scope.coordinateString, businessTypeId, $scope.searchDate||null, serviceId, car)
      .$promise.then(function(result){ 
        $scope.parseStores(result);  
      });
    }
  };

  $scope.enterAddress = function (){
    $scope.showEnterAddress = !$scope.showEnterAddress;
  }

  $scope.parseStores = function (result){
    console.log('parsed the businesses!!!')
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
                $scope.map.rebuild = true;
                console.log('set map rebuild to true')
  };

  $scope.selectUserCar = function (car){
    console.log('you are clicking on a user car!', car);
    if (car.selected) {
      car.selected = false;
      $scope.selectedUserCar = null;
    } else if (!$scope.selectedUserCar){
      car.selected = true;    
      $scope.selectedUserCar = car;
    } else if ($scope.selectedUserCar) {
      $scope.selectedUserCar.selected = false;
      $scope.selectedUserCar = null;
      car.selected = true;
      $scope.selectedUserCar = car;
    }
  };

  // uiGmapGoogleMapApi is a promise.
    // The "then" callback function provides the google.maps object.
    uiGmapGoogleMapApi.then(function(maps) {
        console.log('gmap api is loaded!!!')
        console.log(maps)
uiGmapIsReady.promise(1).then(function(instances) {
  console.log('uigmap is ready!!')
  console.log(instances)
  console.log($scope.map)
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
            Addresses.query(5, $scope.coordinateString, $scope.businessType)
            .$promise.then(function(result){ 
              $scope.parseStores(result);  
            });
        });


    });
});
    }])
  .controller('authController', ['$scope','$state','api','Session','USER_ROLES', 'User', '$modal', authCtrl])
  .controller('StoreDetailController', ['$scope','$stateParams','AddressDetail','CarYears','CarModels','CarMakes','UserCars','Session','UserCarsService','Appointments', storeDetailCtrl])
  .controller('loginModalController', ['$scope','$modalInstance','api','User','Session','USER_ROLES','$rootScope', loginModalCtrl])

  .controller('ProfileCtrl', ['$rootScope','$scope','CarYears','CarModels','CarMakes','UserCars','Session','UserCarsService','Appointments', profileCtrl]);
}());