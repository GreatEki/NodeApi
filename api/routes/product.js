const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-user');
//Bringing in our server controllers
const {
	getProducts,
	saveProduct,
	getOneProduct,
	deleteProduct,
	updateProduct
} = require('../controllers/product');

router
	.route('/')
	.get(getProducts)
	.post(checkAuth, saveProduct);

router
	.route('/:productID')
	.get(getOneProduct)
	.patch(updateProduct)
	.delete(deleteProduct);
module.exports = router;
