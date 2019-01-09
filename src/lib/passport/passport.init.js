import Passport from 'passport';
import PassportMiddleware from './passportMiddleware';

module.exports = {
	build: function(app) {
		app.use(Passport.initialize());
		app.use(Passport.session());
		PassportMiddleware.initAuthWithJwt(Passport)
		PassportMiddleware.initAuthWithFacebook(Passport);
	}
};
