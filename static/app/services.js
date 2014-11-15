var Services = angular.module('AppServices', ['ngResource']);

Services.factory('BusinessTypes', function($resource){
    return {
      query: function() { 
        return $resource('api/type', {}, {
            query: {method:'GET', params:{format:'json'}, isArray:true}
    }).query();
     }
    }
  });
Services.factory('Businesses', function($resource){
    return {
      query: function() { 
        return $resource('api/business', {}, {
            query: {method:'GET', params:{format:'json'}, isArray:true}
    }).query();
     }
    }
  });
Services.factory('CustomizerProperties', function($resource){
    return {
    	query: function(furnituretypeID) { 
    		return $resource('/api/properties/', {}, {
      			query: {method:'GET', params:{format:'json', furniture_type: furnituretypeID }, isArray:true}
    }).query();
     }
    }
  });

Services.factory('Addresses', function($resource){
    return {
    	query: function(distanceParam, locationParam, businessTypeID) { 
    		return $resource('/api/address', {}, {
      			query: {method:'GET', params:{format:'json', business_type: businessTypeID, distance: distanceParam, location: locationParam }, isArray:true}
    }).query();
     }
    }
  });

Services.factory('User', function() {
	return {};
});