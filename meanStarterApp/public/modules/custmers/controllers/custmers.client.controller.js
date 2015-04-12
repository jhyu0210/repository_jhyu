'use strict';

// Custmers controller
angular.module('custmers').controller('CustmersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Custmers',
	function($scope, $stateParams, $location, Authentication, Custmers) {
		$scope.authentication = Authentication;

		// Create new Custmer
		$scope.create = function() {
			// Create new Custmer object
			var custmer = new Custmers ({
				name: this.name
			});

			// Redirect after save
			custmer.$save(function(response) {
				$location.path('custmers/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Custmer
		$scope.remove = function(custmer) {
			if ( custmer ) { 
				custmer.$remove();

				for (var i in $scope.custmers) {
					if ($scope.custmers [i] === custmer) {
						$scope.custmers.splice(i, 1);
					}
				}
			} else {
				$scope.custmer.$remove(function() {
					$location.path('custmers');
				});
			}
		};

		// Update existing Custmer
		$scope.update = function() {
			var custmer = $scope.custmer;

			custmer.$update(function() {
				$location.path('custmers/' + custmer._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Custmers
		$scope.find = function() {
			$scope.custmers = Custmers.query();
		};

		// Find existing Custmer
		$scope.findOne = function() {
			$scope.custmer = Custmers.get({ 
				custmerId: $stateParams.custmerId
			});
		};
	}
]);