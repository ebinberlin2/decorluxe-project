import express from 'express';
import { addProduct, getAllProducts, deleteProduct, getProductById, updateProduct } from '../controllers/ProductReview.js';
import { authMiddleware } from '../middleware/authMiddleware.js'; // Import the middleware
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); 

router.post('/add', authMiddleware, upload.array('images', 5), addProduct); // Apply middleware here
router.get('/view', getAllProducts);
router.delete('/delete/:id', deleteProduct);
router.get('/:id', getProductById);
router.put('/edit/:id', updateProduct);

export default router;
