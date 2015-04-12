'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Custmer = mongoose.model('Custmer'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, custmer;

/**
 * Custmer routes tests
 */
describe('Custmer CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Custmer
		user.save(function() {
			custmer = {
				name: 'Custmer Name'
			};

			done();
		});
	});

	it('should be able to save Custmer instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Custmer
				agent.post('/custmers')
					.send(custmer)
					.expect(200)
					.end(function(custmerSaveErr, custmerSaveRes) {
						// Handle Custmer save error
						if (custmerSaveErr) done(custmerSaveErr);

						// Get a list of Custmers
						agent.get('/custmers')
							.end(function(custmersGetErr, custmersGetRes) {
								// Handle Custmer save error
								if (custmersGetErr) done(custmersGetErr);

								// Get Custmers list
								var custmers = custmersGetRes.body;

								// Set assertions
								(custmers[0].user._id).should.equal(userId);
								(custmers[0].name).should.match('Custmer Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Custmer instance if not logged in', function(done) {
		agent.post('/custmers')
			.send(custmer)
			.expect(401)
			.end(function(custmerSaveErr, custmerSaveRes) {
				// Call the assertion callback
				done(custmerSaveErr);
			});
	});

	it('should not be able to save Custmer instance if no name is provided', function(done) {
		// Invalidate name field
		custmer.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Custmer
				agent.post('/custmers')
					.send(custmer)
					.expect(400)
					.end(function(custmerSaveErr, custmerSaveRes) {
						// Set message assertion
						(custmerSaveRes.body.message).should.match('Please fill Custmer name');
						
						// Handle Custmer save error
						done(custmerSaveErr);
					});
			});
	});

	it('should be able to update Custmer instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Custmer
				agent.post('/custmers')
					.send(custmer)
					.expect(200)
					.end(function(custmerSaveErr, custmerSaveRes) {
						// Handle Custmer save error
						if (custmerSaveErr) done(custmerSaveErr);

						// Update Custmer name
						custmer.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Custmer
						agent.put('/custmers/' + custmerSaveRes.body._id)
							.send(custmer)
							.expect(200)
							.end(function(custmerUpdateErr, custmerUpdateRes) {
								// Handle Custmer update error
								if (custmerUpdateErr) done(custmerUpdateErr);

								// Set assertions
								(custmerUpdateRes.body._id).should.equal(custmerSaveRes.body._id);
								(custmerUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Custmers if not signed in', function(done) {
		// Create new Custmer model instance
		var custmerObj = new Custmer(custmer);

		// Save the Custmer
		custmerObj.save(function() {
			// Request Custmers
			request(app).get('/custmers')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Custmer if not signed in', function(done) {
		// Create new Custmer model instance
		var custmerObj = new Custmer(custmer);

		// Save the Custmer
		custmerObj.save(function() {
			request(app).get('/custmers/' + custmerObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', custmer.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Custmer instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Custmer
				agent.post('/custmers')
					.send(custmer)
					.expect(200)
					.end(function(custmerSaveErr, custmerSaveRes) {
						// Handle Custmer save error
						if (custmerSaveErr) done(custmerSaveErr);

						// Delete existing Custmer
						agent.delete('/custmers/' + custmerSaveRes.body._id)
							.send(custmer)
							.expect(200)
							.end(function(custmerDeleteErr, custmerDeleteRes) {
								// Handle Custmer error error
								if (custmerDeleteErr) done(custmerDeleteErr);

								// Set assertions
								(custmerDeleteRes.body._id).should.equal(custmerSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Custmer instance if not signed in', function(done) {
		// Set Custmer user 
		custmer.user = user;

		// Create new Custmer model instance
		var custmerObj = new Custmer(custmer);

		// Save the Custmer
		custmerObj.save(function() {
			// Try deleting Custmer
			request(app).delete('/custmers/' + custmerObj._id)
			.expect(401)
			.end(function(custmerDeleteErr, custmerDeleteRes) {
				// Set message assertion
				(custmerDeleteRes.body.message).should.match('User is not logged in');

				// Handle Custmer error error
				done(custmerDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Custmer.remove().exec();
		done();
	});
});