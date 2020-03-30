const Product = require('../../models/product');
const mongoose = require('mongoose');

//REQUEST TYPE: GET REQUEST
//@URL: '/api/products/'
//DESC: This fetches all the products fron our database
exports.getProducts = async (req, res, next) => {
	try {
		const products = await Product.find({}).select('name price _id');
		//The select() method helps is chose the properties of the records we want to return from our database
		return res.status(200).json({
			success: true,
			message: 'All Products fetched successfully',
			count: products.length,
			products: products.map(prod => {
				return {
					name: prod.name,
					price: prod.price,
					_id: prod._id,
					request: {
						type: 'GET',
						url: `http:localhost:3000/api/products/${prod._id}`
					}
				};
			})
		});
	} catch (err) {
		return res.status(500).json({
			success: false,
			error: {
				message: 'Server error',
				error: err
			}
		});
	}
};

//REQUEST TYPE: POST REQUEST
//@URL: '/api/products/'
//DESC: //This creates/saves a new Product in our database
exports.saveProduct = async (req, res, next) => {
	try {
		const product = new Product({
			name: req.body.name,
			price: req.body.price
		});

		const savedProduct = await product.save().select('name price _id');

		return res.status(201).json({
			message: 'Handled POST request for /product',
			createdProduct: savedProduct,
			request: {
				type: 'POST',
				url: 'http:localhost:4000/api/products/' + savedProduct._id
			}
		});
	} catch (err) {
		return res.status(500).json({
			message: 'Server Error Occured'
		});
	}
};

//REQUEST TYPE: PATCH REQUEST
//@URL: '/api/products/${productId}'
//This updates a product in our database
exports.updateProduct = async (req, res, next) => {
	try {
		const id = req.params.productId;
		const updateOps = {};

		for (const ops of req.body) {
			updateOps[ops.propName] = ops.value;
		}

		const result = await Product.update({ _id: id }, { $set: { updateOps } });
		/*
		Product.update(
			{ _id: id },
			{ $or: { $set: { name: req.body.newName, price: req.body.newPrice } } }
		); */

		if (result) {
			res.status(200).json({
				success: true,
				message: 'Product Updated Successfully',
				product: result.map(prod => {
					return {
						name: prod.name,
						price: prod.price,
						_id: prod._id,
						request: {
							type: 'PATCH',
							url: `http:localhost:3000/api/products/${res._id}`
						}
					};
				})
			});
		} else {
			res.status(404).json({
				message: 'Product Not Found'
			});
		}
	} catch (err) {
		return res.status(500).json({
			message: 'Server Error Occured'
		});
	}
};

//REQUEST TYPE: GET
//@URL: '/api/products/:productID'
//DESC: This  fetched a particular product from our database
exports.getOneProduct = async (req, res, next) => {
	try {
		const id = req.params.productId;

		const result = await Product.findById(id);
		if (result) {
			return res.status(200).json({
				success: true,
				message: 'Product fetched successfuly',
				product: result.map(prod => {
					return {
						name: prod.name,
						price: prod.price,
						request: {
							type: 'GET',
							url: `htttp:localhost:3000/api/products/${prod._id}`
						}
					};
				})
			});
		} else {
			return res.status(404).json({
				message: 'Product Not Found'
			});
		}
	} catch (err) {
		return res.status(500).json({
			message: 'Server error',
			error: err
		});
	}
};

//REQUEST TYPE: DELETE
//@URL: '/api/products/:productId'
//DESC: This deletes a product from our database
exports.deleteProduct = async (req, res, next) => {
	try {
		const id = req.params.productId;

		const product = await Product.findById({ _id: id });

		if (!product) {
			res.status(404).json({
				message: 'Product does not exist'
			});
		}

		await product.remove();

		return res.status(200).json({
			success: true,
			message: 'Product Deleted Successfully',
			request: {
				type: 'DELETE',
				url: 'http:localhost:3000/api/prodicts',
				body: {
					name: String,
					price: Number
				}
			}
		});
	} catch (err) {
		res.status(500).json({
			message: 'Server Error Occured',
			error: err
		});
	}
};
