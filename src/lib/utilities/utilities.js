import Bycrpt from 'bcryptjs';
import JWT from 'jsonwebtoken';

module.exports = {
	comparePassword(inputPassword, originalPassword) {
		return Bycrpt.compare(inputPassword, originalPassword);
	},
	createHash(toBeHashed) {
		const saltRounds = 10;
		const salt = Bycrpt.genSaltSync(saltRounds);
		const hash = Bycrpt.hashSync(toBeHashed, salt);
		return hash;
	},
	generateToken(dataObject, time) {
		const token = JWT.sign({
			data: dataObject
		}, process.env.SECRET, {
			expiresIn: time
		});
		return token;
	},
	getMessageForMail(type, textInput) {
		switch (type) {
			case 'forgotPassword':
				{
					const message =
						'<p style="font-size:15px;">We received a request to change the password associated with this e-mail address</p><p style="font-size:25px;">Please click  the link that is given below</p><a href = "http://localhost:3000/resetpassword?index=' +
						textInput +
						'">Click me!!</a><p>Thank You</p>';
					return message;
				}
			default:
				return 'HELLO';
		}
	},
	isUserNull(user) {
		return user == null
	}
};