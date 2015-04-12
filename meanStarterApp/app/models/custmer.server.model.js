'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Custmer Schema
 */
var CustmerSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Custmer name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Custmer', CustmerSchema);