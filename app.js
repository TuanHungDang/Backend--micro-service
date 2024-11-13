const express = require('express');
const cors = require('cors');
const productRouter = require('./routes/product.route');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/products', productRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
