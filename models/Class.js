var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var secret = require('../config').secret;

/**
 * A class type
 * @typedef {object} Class
 * @property {string} classname.required 
  */
var ClassSchema = new mongoose.Schema({
  classname: {type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [/^[a-zA-Z0-9]+$/, 'is invalid'], index: true},
  
}, {timestamps: true});

// ClassSchema.plugin(uniqueValidator, {message: 'is already taken.'});


mongoose.model('Class', ClassSchema);
