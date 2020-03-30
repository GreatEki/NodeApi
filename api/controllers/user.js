const jwt = require('jsonwebtoken');
const User = require('../../models/user');
const bcrypt = require('bcryptjs');
const JWT_KEY = require('../../config/config').JWT_KEY;

//REQUEST TYPE: GET
//URL: '/api/users/signin'
//DESC: 'This regster or signsup a user to our service'
exports.signup = async (req, res) => {
	try {
		const email = req.body.email;
		const password = req.body.password;
		//Check to see if email already exists

		if (!email || !password) {
			return res.status(404).json({
				success: false,
				message: 'Email and Password cannot be blank'
			});
		}
		const user = await User.find({ email });

		if (user) {
			return res.status(409).json({
				success: false,
				message: 'Email Already in use'
			});
		} else {
			const newUser = new User({
				email,
				password
			});
			//Hash  the password
			newUser.password = await bcrypt.hashSync(
				password,
				bcrypt.genSaltSync(10, null)
			);
			//Then proceed to save user
			const doc = await User.create(newUser);

			return res.status(201).json({
				success: true,
				message: 'You have signed up successfully',
				user: doc,
				request: {
					type: 'POST',
					url: `http:localhost:3000/api/users/${doc._id}`
				}
			});
		}
	} catch (err) {
		return res.status(500).json({
			success: false,
			message: 'Server Error Occured',
			error: err.message
		});
	}
};

//REQUEST TYPE: POST
//URL: '/api/users/signin'
//DESC: 'This authenticates our user and enable them to sign in to access our service'
exports.signin = async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(404).json({
				success: false,
				message: 'Email and Password fields cannot be blank'
			});
		}

		email.toLowerCase();

		const user = await User.findOne({ email });
		if (!user) {
			return res.status(404).json({
				success: false,
				message: 'Invalid Email'
			});
		}

		const match = await bcrypt.compareSync(password, user.password);

		if (!match) {
			return res.status(404).json({
				success: false,
				message: 'Invalid Email or Password'
			});
		}

		const token = await jwt.sign({ email: user.email }, JWT_KEY, {
			expiresIn: '1h'
		});

		return res.status(200).json({
			success: true,
			message: 'Authentication sucess',
			user: {
				email: user.email
			},
			token
		});
	} catch (err) {
		return res.status(500).json({
			success: false,
			message: 'Server Error',
			error: err
		});
	}
};
