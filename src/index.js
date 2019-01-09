import express from 'express';
import Parser from 'body-parser';
import Boom from 'express-boom';
import cors from 'cors';
import DotEnv from 'dotenv';
import Router from './routes';
import DataBase from './lib/dbConnection/mongo.init';
import Passport from './lib/passport/passport.init';
import { Log, LogMiddleware } from './services/log';

//express
const app = express();

//EnvironmentVariables
DotEnv.load();

const port = process.env.PORT || 5000;

//Connecting to mongoos
DataBase.connection();

// Add cors Middleware
app.use(cors());

//body-parser
app.use(
	Parser.json({
		limit: '50mb'
	})
);

//express-boom
app.use(Boom());

//For Logs
app.use(LogMiddleware);

//Passport Middleware
Passport.build(app);

// Add The Routes
Router.build(app);

//Listen to Port
app.listen(port, '0.0.0.0', (err) => {
	if (err) {
		Log.info(err);
	} else {
		Log.info('Server started on: ', port);
	}
});

module.exports = app;
