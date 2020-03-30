const Order = require('../../models/order');

//REQUEST TYPE: POST
//URL: '/api/orders/
//DESC This creates/places a new order in our database'
exports.placeOrder = async (req, res, next) => {
	try {
		const order = new Order({
			_id: mongoose.Types.ObjectId(),
			product: req.body.productId
		});

		const doc = await order
			.save()
			.select('_id product quantity')
			.populate('product', '_id name price');

		return res.status(201).json({
			success: true,
			message: 'Order placed successfully',
			request: {
				type: POST,
				url: 'http:localhost:3000/api/orders/',
				data: {
					_id: doc._id,
					product: doc.product,
					quantity: doc.quantity
				}
			}
		});
	} catch (err) {
		if (err.name === 'ValidationError') {
			const message = Object.values(err.errors).map(val => val.message);
			return res.status(404).json({
				success: false,
				message
			});
		} else {
			return res.status(500).json({
				success: false,
				message: 'Server error occured',
				error: err
			});
		}
	}
};

//REQUEST TYPE: GET
//URL: '/api/orders/'
//DESC: This fetches all orders from our datatbase
exports.getAllOrders = async (req, res, next) => {
	try {
		const docs = await Order.find({})
			.select('_id product quantity')
			.populate('product', '_id name price');
		/*The populate() method is a mongoose method that allows us to 
		retrieve more properties of any model we are referencing in our queried model.
		*/
		return res.status(200).json({
			success: true,
			message: 'All Orders fetched successfully',
			count: `${docs.length} orders returned`,
			orders: docs.map(doc => {
				return {
					_id: doc._id,
					product: doc.product,
					quantity: doc.quantity,
					request: {
						type: 'GET',
						url: `http:localhost:3000/api/orders/`
					}
				};
			})
		});
	} catch (err) {
		return res.status(500).json({
			success: false,
			message: 'Server Error Occurred',
			error: err
		});
	}
};

//REQUEST TYPE: GET REQUEST
//URL: '/api/orders/:orderID'
//DESC: The fetches a single order from our database.
exports.getOneOrder = async (req, res, next) => {
	try {
		const orderId = req.body.order;

		const result = await Order.find({ _id: orderId })
			.select('_id product quantity')
			.populate('product', '_id name quantity');
		/*The populate() method is a mongoose method that allows us to 
		retrieve more properties of any model we are referencing in our queried model.
		*/
		if (!result) {
			return res.status(404).json({
				success: false,
				message: 'Order Not Found'
			});
		} else {
			return res.status(200).json({
				success: true,
				message: 'Order fetched sucessfully',
				order: result,
				request: {
					type: 'GET',
					url: 'http:localhost:3000/api/orders/' + result._id
				}
			});
		}
	} catch (err) {
		return res.status(500).json({
			success: false,
			message: 'Server Error Occurred: Could Not proxy request'
		});
	}
};
