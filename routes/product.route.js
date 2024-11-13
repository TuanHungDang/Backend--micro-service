const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

router.post('/create-products', upload.array('images', 100), productController.createProduct);

module.exports = router;
