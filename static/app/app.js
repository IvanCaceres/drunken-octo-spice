'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ui.router',
  'ngResource',
  'myApp.home',
  'AppServices'
]).
// config(['$routeProvider', function($routeProvider) {
//   $routeProvider.otherwise({redirectTo: '/view1'});
// }]);
// config(function($routeProvider, $locationProvider) {

// 		$routeProvider
// 			.when('/', {
// 				templateUrl : '/static/app/home/home.html',

// 			})
// 			.when('/about', {
// 				templateUrl : '/static/app/view1/view1.html',
// 			})
// 			.when('/contact', {
// 				templateUrl : 'partials/contact.html',
// 			}).when('/customizer', {
// 				templateUrl : '/static/app/customizer/select.html',
// 			}).when('/customizer/select', {
// 				templateUrl : '/static/app/customizer/select.html',
// 			}).when('/tables/type', {
// 				templateUrl : '/static/app/tables/type.html',
// 			}).otherwise({
//                 redirectTo : '/'
//             });

	
// 		// use the HTML5 History API
// 		$locationProvider.html5Mode(true);
// 	});

config(function($stateProvider, $urlRouterProvider, $locationProvider) {
  //
  //
  // Now set up the states
  $stateProvider
  .state('home', {
      url: "/",
      templateUrl: "/static/app/home/home.html",
      controller: 'HomeCtrl'
    })
    .state('stores', {
      url: "/stores/",
      templateUrl: "/static/app/home/search.html",
      controller: 'StoreMapCtrl'
    })
    // .state('customizer', {
    //   url: "/customizer/",
    //   templateUrl: "/static/app/customizer/select.html",
    //   controller: 'CustomizerCtrl'
    // })
    // .state('customizer.type', {
    //   url: ":type/",
    //   views:{
    //            "content":{
    //             templateUrl: "/static/app/customizer/type.html",
    //             controller: 'CustomizerTypeCtrl'
    //             }
    //        },
      
    // })
  // For any unmatched url, redirect to /state1
  $urlRouterProvider.otherwise("/");
    //use the HTML5 History API
		$locationProvider.html5Mode(true);
});
