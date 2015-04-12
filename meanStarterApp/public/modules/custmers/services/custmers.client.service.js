'use strict';

//Custmers service used to communicate Custmers REST endpoints
angular.module('custmers').factory('Custmers', ['$resource',
	function($resource) {
		return $resource('custmers/:custmerId', { custmerId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);