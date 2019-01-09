import { Log } from '../../services/log';
import Mongoose from 'mongoose';
import Utilities from '../utilities/utilities';

const userSchema = Mongoose.Schema({
	name: {
		type: String,
		require: true
	},
	email: {
		type: String,
		required: true
	},
	userName: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	}
});

const User = Mongoose.model('User', userSchema, 'users');

module.exports = {
	//Get User by Email
	async getUserByEmail(email) {
		const query = {
			email: email
		};
		return User.findOne(query);
	},

	//Add the User to DataBase
	async addUser(newUser) {
		try {
			const hash = Utilities.createHash(newUser.password);
			newUser.password = hash;
			let user = new User(newUser);
			return user.save();
		} catch (error) {
			Log.error(error);
			throw error;
		}
	},
	//Get User by Id
	async getUserById(Id) {
		try {
			return User.findById(Id);
		} catch (error) {
			Log.error(error);
			throw error;
		}
	},
	async updateUserProperty(query, toUpdatePropsQuery) {
		try {
			return User.findOneAndUpdate(query, toUpdatePropsQuery);
		} catch (error) {
			Log.error(error);
			throw error;
		}
	}
};
