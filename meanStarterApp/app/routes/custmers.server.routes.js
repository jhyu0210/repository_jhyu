'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var custmers = require('../../app/controllers/custmers.server.controller');

	// Custmers Routes
	app.route('/custmers')
		.get(custmers.list)
		.post(users.requiresLogin, custmers.create);

	app.route('/custmers/:custmerId')
		.get(custmers.read)
		.put(users.requiresLogin, custmers.hasAuthorization, custmers.update)
		.delete(users.requiresLogin, custmers.hasAuthorization, custmers.delete);

	// Finish by binding the Custmer middleware
	app.param('custmerId', custmers.custmerByID);
};
