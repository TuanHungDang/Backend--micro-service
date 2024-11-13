const shopifyConfig = require('../config/shopify');
const fs = require('fs');

exports.createProduct = async (req, res) => {
    const { title, body_html, price } = req.body;
    const files = req.files;

    if (!files || files.length === 0) {
        return res.status(400).json({ error: 'Image files are required.' });
    }

    try {
        const images = files.map(file => {
            const imageBase64 = fs.readFileSync(file.path, { encoding: 'base64' });
            return {
                attachment: imageBase64,
                filename: file.originalname
            };
        });

        // Tạo sản phẩm với các ảnh được mã hóa base64
        const productData = {
            product: {
                title: title,
                body_html: body_html,
                variants: [
                    {
                        price: price
                    }
                ],
                images: images
            }
        };

        // Sử dụng import() động cho node-fetch
        const fetch = (await import('node-fetch')).default;

        const response = await fetch(`${shopifyConfig.apiUrl}/products.json`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Access-Token': shopifyConfig.password
            },
            body: JSON.stringify(productData)
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            return res.status(response.status).json({ error: errorResponse.errors || 'Failed to create product.' });
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        if (files && files.length > 0) {
            files.forEach(file => {
                fs.promises.unlink(file.path).catch(err => console.error('Error deleting file:', err));
            });
        }
    }
};
