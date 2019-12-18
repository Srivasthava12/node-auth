import express from 'express';
import Parser from 'body-parser';
import Boom from 'express-boom';
import cors from 'cors';
import DotEnv from 'dotenv';
import Router from './routes';
import Socket from 'socket.io';
import DataBase from './lib/dbConnection/mongo.init';
import Passport from './lib/passport/passport.init';
import Session from './services/session';
import { Log, LogMiddleware } from './services/log';

//express
const app = express();

//Setting up server
const server = require('http').Server(app);

//EnvironmentVariables
DotEnv.load();

const port = process.env.PORT || 5000;

//Connecting to mongoos
DataBase.connection();

// Connecting sockets to the server and adding them to the request
// so that we can access them later in the controller
const io = Socket(server);
app.set('io', io);

// Add cors Middleware
app.use(cors());

//body-parser
app.use(
	Parser.json({
		limit: '50mb'
	})
);

app.use(Session);

// This custom middleware allows us to attach the socket id to the session
// With that socket id we can send back the right user info to the right
// socket
app.use((req, res, next) => {
	if (req.query.socketId) req.session.socketId = req.query.socketId;
	next();
});

//express-boom
app.use(Boom());

//For Logs
app.use(LogMiddleware);

//Passport Middleware
Passport.build(app);

// Add The Routes
Router.build(app);

//Listen to Port
server.listen(port, (err) => {
	if (err) {
		Log.info(err);
	} else {
		Log.info('Server started on: ', port);
	}
});

module.exports = app;
