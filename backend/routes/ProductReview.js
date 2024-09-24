import { addProduct, getAllProducts, deleteProduct, getProductById} from '../controllers/ProductReview.js';
import express from 'express';

const router = express.Router();

router.post('/add', addProduct);
router.get('/view', getAllProducts);
router.delete('/delete/:id', deleteProduct);
router.get('/:id', getProductById);

export default router;