const mongoose = require('mongoose');
const db = require('./config').MONGO_URI;

const connectDB = async () => {
	try {
		const conn = await mongoose.connect(db, {
			useNewUrlParser: true,
			useCreateIndex: true,
			useUnifiedTopology: true
		});

		console.log(`mongoDB connected successfully ${conn.connection.host}`);
	} catch (err) {
		console.log(err.message);
		process.exit();
	}
};

module.exports = connectDB;
