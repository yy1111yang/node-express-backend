var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var secret = require('../config').secret;

/**
 * A center type
 * @typedef {object} Center
 * @property {string} centername.required 
  */
var ClassSchema = new mongoose.Schema({
  centername: {type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [/^[a-zA-Z0-9]+$/, 'is invalid'], index: true}
  
  
  
}, {timestamps: true});

// ClassSchema.plugin(uniqueValidator, {message: 'is already taken.'});


mongoose.model('Class', ClassSchema);
