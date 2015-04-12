'use strict';

(function() {
	// Custmers Controller Spec
	describe('Custmers Controller Tests', function() {
		// Initialize global variables
		var CustmersController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Custmers controller.
			CustmersController = $controller('CustmersController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Custmer object fetched from XHR', inject(function(Custmers) {
			// Create sample Custmer using the Custmers service
			var sampleCustmer = new Custmers({
				name: 'New Custmer'
			});

			// Create a sample Custmers array that includes the new Custmer
			var sampleCustmers = [sampleCustmer];

			// Set GET response
			$httpBackend.expectGET('custmers').respond(sampleCustmers);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.custmers).toEqualData(sampleCustmers);
		}));

		it('$scope.findOne() should create an array with one Custmer object fetched from XHR using a custmerId URL parameter', inject(function(Custmers) {
			// Define a sample Custmer object
			var sampleCustmer = new Custmers({
				name: 'New Custmer'
			});

			// Set the URL parameter
			$stateParams.custmerId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/custmers\/([0-9a-fA-F]{24})$/).respond(sampleCustmer);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.custmer).toEqualData(sampleCustmer);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Custmers) {
			// Create a sample Custmer object
			var sampleCustmerPostData = new Custmers({
				name: 'New Custmer'
			});

			// Create a sample Custmer response
			var sampleCustmerResponse = new Custmers({
				_id: '525cf20451979dea2c000001',
				name: 'New Custmer'
			});

			// Fixture mock form input values
			scope.name = 'New Custmer';

			// Set POST response
			$httpBackend.expectPOST('custmers', sampleCustmerPostData).respond(sampleCustmerResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Custmer was created
			expect($location.path()).toBe('/custmers/' + sampleCustmerResponse._id);
		}));

		it('$scope.update() should update a valid Custmer', inject(function(Custmers) {
			// Define a sample Custmer put data
			var sampleCustmerPutData = new Custmers({
				_id: '525cf20451979dea2c000001',
				name: 'New Custmer'
			});

			// Mock Custmer in scope
			scope.custmer = sampleCustmerPutData;

			// Set PUT response
			$httpBackend.expectPUT(/custmers\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/custmers/' + sampleCustmerPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid custmerId and remove the Custmer from the scope', inject(function(Custmers) {
			// Create new Custmer object
			var sampleCustmer = new Custmers({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Custmers array and include the Custmer
			scope.custmers = [sampleCustmer];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/custmers\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleCustmer);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.custmers.length).toBe(0);
		}));
	});
}());