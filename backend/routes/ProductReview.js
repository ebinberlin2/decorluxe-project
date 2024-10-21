import { addProduct, getAllProducts, deleteProduct, getProductById, updateProduct } from '../controllers/ProductReview.js';
import express from 'express';
// import upload from '../middleware/upload.js'; // Adjust the path as necessary
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); 

router.post('/add', upload.array('images', 5), addProduct);
router.get('/view', getAllProducts);
router.delete('/delete/:id', deleteProduct);
router.get('/:id', getProductById);
router.put('/edit/:id', updateProduct);

export default router;