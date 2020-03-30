const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
	_id: mongoose.Schema.Types.ObjectId,
	product: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Product',
		required: [true, 'Cannot place Order without any product']
	},
	quantity: { type: Number, default: 1 }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
