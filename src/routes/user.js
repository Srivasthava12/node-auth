import Express from 'express';
import Joi from 'joi';
import User from '../services/user';
import Util from 'util';
import Passport from 'passport';
import PassportMiddleware from '../lib/passport/passportMiddleware';
import JWT from 'jsonwebtoken'

const router = Express.Router();

router.config = {
	schema: {
		userRegistration: Joi.object().keys({
			name: Joi.string().required(true),
			email: Joi.string().required(true),
			userName: Joi.string().required(true),
			password: Joi.string().required(true)
		}),
		userAuthentication: Joi.object().keys({
			email: Joi.string().required(true),
			password: Joi.string().required(true)
		}),
		userforgotpassword: Joi.object().keys({
			email: Joi.string().required(true)
		})
	}
};

//Register the User
router.post('/register', async (req, res) => {
	let payload = {
		name: req.body.name,
		email: req.body.email,
		userName: req.body.userName,
		password: req.body.password
	};
	const result = Joi.validate(payload, router.config.schema.userRegistration);

	if (result.error) {
		req.log.info(`Error encountered ${Util.inspect(result, { depth: null })}`);
		return res.boom.badData(result.error);
	}
	try {
		const response = await User.registration(payload);
		return res.json(response);
	} catch (error) {
		return res.boom.badRequest('Error in registering the user', error);
	}
});

//Authentication
router.post('/authenticate', async (req, res) => {
	const email = req.body.email;
	const password = req.body.password;

	let payload = {
		email,
		password
	};

	const result = Joi.validate(payload, router.config.schema.userAuthentication);

	if (result.error) {
		req.log.info(`Error encountered ${Util.inspect(result, { depth: null })}`);
		return res.boom.badData(result.error);
	}
	try {
		const response = await User.authenticate(email, password);
		return res.json({ response });
	} catch (error) {
		return res.boom.badRequest('Error in authenticating the user', error);
	}
});

//Authentication with facebook
router.get('/authenticate/facebook', Passport.authenticate('facebook', { scope: [ 'email' ] }));

router.get('/authenticate/facebook/return', Passport.authenticate('facebook', { failureRedirect: '/login' }), function(req, res) {
	const token = JWT.sign({ data: req.user._json }, 'secret', { expiresIn: 604800 });
	res.writeHead(301, { Location: `http://localhost:3000/profile?index=${token}` });
	res.end();
});

//Profile
router.get('/profile', PassportMiddleware.authWithJwt(Passport), (req, res) => {
	res.json({
		name: req.user.name,
		userName: req.user.userName,
		email: req.user.email
	});
});

//ForgotPassword
router.post('/forgotpassword', async (req, res) => {
	const email = req.body.email;
	let payload = {
		email
	};
	const result = Joi.validate(payload, router.config.schema.userforgotpassword);

	if (result.error) {
		req.log.info(`Error encountered ${Util.inspect(result, { depth: null })}`);
		return res.boom.badData(result.error);
	}
	try {
		const response = await User.forgotPassword(email);
		return res.json(response);
	} catch (error) {
		return res.boom.badRequest('Error in Processing Forgotpassword', error);
	}
});

module.exports = router;
