import Mongo from '../lib/dbConnection/mongodb';
import Utilities from '../lib/utilities/utilities';
import MailService from './mail';
import { Log } from './log';

module.exports = {
	async registration(newUser) {
		try {
			//To check if the email has been registered
			const user = await Mongo.getUserByEmail(newUser.email);
			if (Utilities.isUserNull(user)) {
				const response = await this.addUser(newUser);
				return response;
			} else {
				return {
					success: false,
					message: 'Email addresss is already been Registered. Try with a new one'
				};
			}
		} catch (error) {
			Log.error(error);
			throw error;
		}
	},

	async authenticate(email, passoword) {
		try {
			//To check if the email has been registered
			const user = await Mongo.getUserByEmail(email);
			if (Utilities.isUserNull(user))
				return {
					success: false,
					message: 'Email or Password is wrong'
				};
			//Comparing passwords
			const isMatched = await Utilities.comparePassword(passoword, user.password);
			if (isMatched) {
				const userData = {
					name: user.name,
					username: user.username,
					email: user.email
				}
				//Preparing  JWT token
				const token = Utilities.generateToken(dataToJWTGen, 604800 /*1 week*/ );
				return {
					success: true,
					message: 'Successfull Login ',
					token: 'JWT ' + token,
					user: userData
				};
			}
			return {
				success: false,
				message: 'Email or Password is wrong'
			};
		} catch (error) {
			Log.error(error);
			throw error;
		}
	},

	async forgotPassword(email) {
		try {
			//To check if the email has been registered
			const user = await Mongo.getUserByEmail(email);
			if (Utilities.isUserNull(user)) {
				return {
					success: false,
					message: "Can't find that email, sorry."
				};
			}
			//Preparing  JWT token
			const token = Utilities.generateToken(user, 600 /*10 mins*/ );
			const message = Utilities.getMessageForMail('forgotPassword', token);
			const info = await MailService.nodeMailer(email, 'ProjectZeros Password Assistance', message);
			if (info) {
				return {
					success: true,
					message: 'Mail is sent to the registered mail address'
				};
			}
		} catch (error) {
			Log.error(error);
			throw error;
		}
	},

	async changePassword(payload) {
		try {
			const oldPassword = payload.oldPassword;
			const newPassword = payload.newPassword;
			const email = payload.email;
			const user = await Mongo.getUserByEmail(email);
			if (Utilities.isUserNull(user))
				return {
					success: false,
					message: 'Email or Password is wrong'
				};
			const isMatched = await Utilities.comparePassword(oldPassword, user.password);
			if (isMatched) {
				const newPasswordHash = Utilities.createHash(newPassword);
				const toUpdatePair = {
					password: newPasswordHash
				};
				const user = await this.updateProperty(email, toUpdatePair);
				if (user)
					return {
						success: true,
						msg: 'Password is Changed'
					};
				return {
					success: false,
					msg: 'Password is not Changed'
				};
			}
			return {
				success: false,
				msg: 'Wrong Password'
			};
		} catch (error) {
			Log.error(error);
			throw error;
		}
	},

	async updateProperty(email, toUpdatePair) {
		try {
			const query = {
				email
			};
			const user = await Mongo.updateUserProperty(query, toUpdatePair);
			return user;
		} catch (error) {
			Log.error(error);
			throw error;
		}
	},

	async addUser(newUser) {
		try {
			//Saving the user data in database
			const addedUser = await Mongo.addUser(newUser);
			if (addedUser)
				return {
					success: true,
					message: 'Successfully User Registered '
				};
			else
				return {
					success: false,
					message: 'Unsuccessfull in Registering the User '
				};
		} catch (error) {
			Log.error(error);
			throw error;
		}
	}
};