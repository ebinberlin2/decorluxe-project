import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';

//Authentication
import loginRoutes from './routes/loginRoutes.js';
import SignupRoutes from './routes/SignupRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
//seller
import ProductReview from './routes/ProductReview.js';
import WishlistRoutes from './routes/WishlistRoutes.js';
import SellerRoutes from './routes/SellerRoutes.js';
import auth from  './routes/auth.js';
import  verifyToken  from './middleware/authenticateToken.js';
import userDetailsRouter from './routes/UserDetailsRoutes.js';
import cartRoutes from './routes/cartRoutes.js';


const app = express();
const port = 5000;
connectDB();



app.use(cors()); 
app.use(express.json());
app.use('/api/login', loginRoutes);
app.use('/api/user/signup', SignupRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', ProductReview);
app.use('/api/wishlist', WishlistRoutes); //
app.use('/api/seller/signup', SellerRoutes); //
app.use('/api/auth', auth);
app.use('/api/userDetails', userDetailsRouter);
app.use('/api/cart', cartRoutes); //




app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
