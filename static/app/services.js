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
Services.factory('api', function($resource){
        function add_auth_header(data, headersGetter){
            // as per HTTP authentication spec [1], credentials must be
            // encoded in base64. Lets use window.btoa [2]
            var headers = headersGetter();
            headers['Authorization'] = ('Basic ' + btoa(data.username +
                                        ':' + data.password));
        }
        // defining the endpoints. Note we escape url trailing dashes: Angular
        // strips unescaped trailing slashes. Problem as Django redirects urls
        // not ending in slashes to url that ends in slash for SEO reasons, unless
        // we tell Django not to [3]. This is a problem as the POST data cannot
        // be sent with the redirect. So we want Angular to not strip the slashes!
        return {
            auth: $resource('/api/auth\\/', {}, {
                login: {method: 'POST', transformRequest: add_auth_header},
                logout: {method: 'DELETE'}
            }),
            users: $resource('/api/users\\/', {}, {
                create: {method: 'POST'}
            })
        };
    });