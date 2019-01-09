import Pino from 'express-pino-logger';

// Add Middlewares
export const LogMiddleware = Pino({
	name: 'NodeProject'
});

export const Log = LogMiddleware.logger;
