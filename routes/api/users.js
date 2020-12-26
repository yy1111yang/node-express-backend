var mongoose = require('mongoose');
var router = require('express').Router();
var passport = require('passport');
var User = mongoose.model('User');
var auth = require('../auth');

 /**
 * GET /api/user
 * @summary 사용자 정보를 조회한다.
 * @security BearerAuth
 * @tags User
 * @return {array<User>} 200 - success response - application/json
 */
router.get('/user', auth.required, function(req, res, next){
  User.findById(req.payload.id).then(function(user){
    if(!user){ return res.sendStatus(401); }

    return res.json({user: user.toAuthJSON()});
  }).catch(next);
});

/**
 * PUT /api/user
 * @summary 사용자 정보를 수정한다.
 * @security BearerAuth
 * @tags User
 * @param {string} username.form.required
 * @param {string} email.form.required
 * @param {string} password.form.required
 * @return {object} 200 - success response - application/json
 * @example request - application/json
 * {
 *   "username": "test101",
 *   "email": "test101@naver.com",
 *   "password": "password"
 * }  
 */
router.put('/user', auth.required, function(req, res, next){
  User.findById(req.payload.id).then(function(user){
    if(!user){ return res.sendStatus(401); }

    // only update fields that were actually passed...
    if(typeof req.body.username !== 'undefined'){
      user.username = req.body.username;
    }
    if(typeof req.body.email !== 'undefined'){
      user.email = req.body.email;
    }
    if(typeof req.body.bio !== 'undefined'){
      user.bio = req.body.bio;
    }
    if(typeof req.body.image !== 'undefined'){
      user.image = req.body.image;
    }
    if(typeof req.body.password !== 'undefined'){
      user.setPassword(req.body.password);
    }

    return user.save().then(function(){
      return res.json({user: user.toAuthJSON()});
    });
  }).catch(next);
});

/**
 * POST /api/users/login
 * @summary 로그인을 한다.
 * @tags User
 * @param {string} email.form.required
 * @param {string} password.form.required
 * @return {array<User>} 200 - success response - application/json
 * @example request - application/json
 * {
 *   "email": "test101@naver.com",
 *   "password": "password"
 * } 
 */
router.post('/users/login', function(req, res, next){
  if(!req.body.email){
    return res.status(422).json({errors: {email: "can't be blank"}});
  }

  if(!req.body.password){
    return res.status(422).json({errors: {password: "can't be blank"}});
  }
  
  passport.authenticate('local', {session: false}, function(err, user, info){
    if(err){ return next(err); }

    if(user){
      user.token = user.generateJWT();
      return res.json({user: user.toAuthJSON()});
    } else {
      return res.status(422).json(info);
    }
  })(req, res, next);
});

/**
 * POST /api/users
 * @summary 사용자 정보를 등록한다.
 * @tags User
 * @param {string} username.form.required
 * @param {string} email.form.required
 * @param {string} password.form.required
 * @return {array<User>} 200 - success response - application/json
 * @example request - application/json
 * {
 *   "username": "test101",
 *   "email": "test101@naver.com",
 *   "password": "password"
 * } 
 */
router.post('/users', function(req, res, next){
  var user = new User();
  user.username = req.body.username;
  user.email = req.body.email;
  user.hash = req.body.password;
  user.salt = req.body.password;
  user.setPassword(req.body.password);

  user.save().then(function(){
    return res.json({user: user.toAuthJSON()});    
  }).catch(next);
});

router.get('/users/test', function(req, res, next){
  return res.json("1234");
});

module.exports = router;
