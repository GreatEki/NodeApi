const express = require('express');
const router = express.Router();
const {
	placeOrder,
	getAllOrders,
	getOneOrder
} = require('../controllers/order');
const checkAuth = require('../middleware/check-user');
router
	.route('/')
	.post(checkAuth, placeOrder)
	.get(checkAuth, getAllOrders);

router.route('/:orderId').get(checkAuth, getOneOrder);

module.exports = router;
