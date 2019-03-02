const JwtStrategy = require('passport-jwt').Strategy;
const FaceBookStrategy = require('passport-facebook').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const Mongo = require('../dbConnection/mongodb');

module.exports = {
	initAuthWithJwt: function(passport) {
		let opts = {};
		opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
		opts.secretOrKey = process.env.SECRET;
		passport.use(
			new JwtStrategy(opts, async (jwt_payload, done) => {
				try {
					const user = await Mongo.getUserById(jwt_payload.data._id);
					if (user) return done(null, user);
					return done(null, false);
				} catch (error) {
					Log.error(error);
					return done(error, false);
				}
			})
		);
	},
	authWithJwt: function(Passport) {
		return Passport.authenticate('jwt', { session: false });
	},
	initAuthWithFacebook: function(passport) {
		passport.use(
			new FaceBookStrategy(
				{
					//Client ID from Facebook Developer
					clientID: process.env.CLIENT_ID,
					clientSecret: process.env.CLIENT_SECRET,
					callbackURL: `${process.env.SERVER_URL}/user/authenticate/facebook/return`,
					profileFields: [ 'id', 'displayName', 'photos', 'email' ]
				},
				function(accessToken, refreshToken, profile, cb) {
					return cb(null, profile);
				}
			)
		);
		passport.serializeUser(function(user, cb) {
			cb(null, user);
		});

		passport.deserializeUser(function(obj, cb) {
			cb(null, obj);
		});
	},
	authWithFacebook: function(Passport) {
		return Passport.authenticate('facebook', { scope: [ 'email' ] });
	}
};
