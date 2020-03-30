const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
	name: { type: String, required: [true, 'Product Name is required'] },
	price: { type: Number, required: [true, 'Product Price is required'] }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
