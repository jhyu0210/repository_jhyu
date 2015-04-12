'use strict';

//Setting up route
angular.module('custmers').config(['$stateProvider',
	function($stateProvider) {
		// Custmers state routing
		$stateProvider.
		state('listCustmers', {
			url: '/custmers',
			templateUrl: 'modules/custmers/views/list-custmers.client.view.html'
		}).
		state('createCustmer', {
			url: '/custmers/create',
			templateUrl: 'modules/custmers/views/create-custmer.client.view.html'
		}).
		state('viewCustmer', {
			url: '/custmers/:custmerId',
			templateUrl: 'modules/custmers/views/view-custmer.client.view.html'
		}).
		state('editCustmer', {
			url: '/custmers/:custmerId/edit',
			templateUrl: 'modules/custmers/views/edit-custmer.client.view.html'
		});
	}
]);