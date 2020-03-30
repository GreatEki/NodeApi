const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
	try {
		//We receive the token from our request headers authorization.
		//We then split the values stored in the 'token to eliminate whitespaces' using the split()method
		//And we then specify what part of the token we want using the [1] key.
		const token = req.headers.authorization.split(' ')[1];
		const decoded = jwt.verify(token, process.env.JWT_KEY);
		req.userData = decoded;
		next();
	} catch (err) {
		return res.status(401).json({
			success: false,
			message: 'Authorization Failed'
		});
	}
};
