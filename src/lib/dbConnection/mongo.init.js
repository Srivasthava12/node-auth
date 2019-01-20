import Mongoose from 'mongoose';
import { Log } from '../../services/log';

module.exports = {
	connection: function() {
		Mongoose.connect(process.env.DATA_BASE,  { useNewUrlParser: true });

		Mongoose.connection.on('connected', () => {
			Log.info('Connected to Database', process.env.DATA_BASE);
		});

		Mongoose.connection.on('error', (err) => {
			Log.info('Connecting to Database ERROR', err);
		});
	}
};
