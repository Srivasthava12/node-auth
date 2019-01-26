import Session from 'express-session';

// saveUninitialized: true allows us to attach the socket id to the session
// before we have athenticated the user
export default Session({
	secret: 'mysecret',
	resave: true,
	saveUninitialized: true
});
