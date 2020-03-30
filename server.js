const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const morgan = require('morgan');
const APPMODE = require('./config/config').NODE_ENV;

//Initialise express application
const app = express();

app.use(express.json());

//Connect to Database
connectDB();

dotenv.config({ path: '/config/config.env' });

//Initalising morgan for our application
//Morgan is third party dependency that logs information about our routes to the console.
app.use(morgan('dev'));

/* 
    CORS - HANDLE CORS
*/
//Cross Origin Resource Sharing CORS
app.use((req, res, next) => {
	//This allows access to request from different origins.
	res.header('Access-Control-Allow-Origin', '*');
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept, Authorization'
	);

	if (req.method === 'OPTIONS') {
		res.header('Acesss-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
		return res.status(200).json({});
	}

	next();
});

//Importing routes
app.use('/api/products', require('./api/routes/product'));
app.use('/api/orders', require('./api/routes/order'));
app.use('/api/users', require('./api/routes/user'));

//Handle Errors
//This handles error that may arise as a result of non-exisitng routes
app.use((req, res, next) => {
	const error = new Error('Not Found');
	error.status = 404;
	next(error);
});

app.use((error, req, res, next) => {
	res.status(error.status || 500);
	res.json({
		error: {
			message: error.message
		}
	});
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () =>
	console.log(`Server running in ${APPMODE} mode on port ${PORT} `)
);
