'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Custmer = mongoose.model('Custmer'),
	_ = require('lodash');

/**
 * Create a Custmer
 */
exports.create = function(req, res) {
	var custmer = new Custmer(req.body);
	custmer.user = req.user;

	custmer.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(custmer);
		}
	});
};

/**
 * Show the current Custmer
 */
exports.read = function(req, res) {
	res.jsonp(req.custmer);
};

/**
 * Update a Custmer
 */
exports.update = function(req, res) {
	var custmer = req.custmer ;

	custmer = _.extend(custmer , req.body);

	custmer.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(custmer);
		}
	});
};

/**
 * Delete an Custmer
 */
exports.delete = function(req, res) {
	var custmer = req.custmer ;

	custmer.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(custmer);
		}
	});
};

/**
 * List of Custmers
 */
exports.list = function(req, res) { 
	Custmer.find().sort('-created').populate('user', 'displayName').exec(function(err, custmers) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(custmers);
		}
	});
};

/**
 * Custmer middleware
 */
exports.custmerByID = function(req, res, next, id) { 
	Custmer.findById(id).populate('user', 'displayName').exec(function(err, custmer) {
		if (err) return next(err);
		if (! custmer) return next(new Error('Failed to load Custmer ' + id));
		req.custmer = custmer ;
		next();
	});
};

/**
 * Custmer authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.custmer.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
