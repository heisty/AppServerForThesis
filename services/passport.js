const User = require('../models/staffschema');
const config = require('../config');

const passport = require('passport');
const ExtractJwt = require('passport-jwt').ExtractJwt;
const JwtStrategy  = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local');

var jwtOptions = {
	secretOrKey: config.secret,
	jwtFromRequest: ExtractJwt.fromHeader('authorization')
}

var localOptions = {
	usernameField: 'username',
}

var localStrategy = new LocalStrategy(localOptions,function(username,password,done){
	User.findOne({username: username}, function(err,user){
		if(err) {return done(err)}
		if(!user){ return done(null,false)}
		user.comparePassword(password, function(err,isMatch){
			if(err) { return done(err)}
			if(!isMatch){ return done(null,false)}
			return done(null,user);

		});
	});
});

var jwtStrategy = new JwtStrategy(jwtOptions, function(payload,done){
	User.findById(payload.sub, function(err,user){
		if(err){ return done(err,false)}
		if(user){
			done(null,true);
		}
		else{
			done(null,false);
		}
	});
});

passport.use(jwtStrategy);
passport.use(localStrategy);