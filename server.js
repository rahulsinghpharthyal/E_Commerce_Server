import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import Connection from './database/databaseConnection.js';
dotenv.config({path: './config/.env'});

const app = express();

app.use(
    cors({
        origin: ['http://localhost:5173', 'https://main--dummycommerce.netlify.app/', 'https://dummycommerce.netlify.app/'],
        methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
        credentials: true
    })
);

app.use(cookieParser());
app.use(express.json());

// -------------------------Routes---------------------------------
import authRouter from './routes/auth_route.js';
import adminProductRoute from './routes/admin/products_route.js';
import getFilteredProducts from './routes/shop/filterProductsRoute.js';
import cartItemRoute from './routes/shop/cartItemRoute.js';
import addressRoute from './routes/shop/addressRoute.js'
import orderRoute from './routes/shop/orderRoute.js';

app.use('/api/auth', authRouter);
app.use('/api/admin/products', adminProductRoute);


// ------shoping----------------
app.use('/api/shop/products', getFilteredProducts);
app.use('/api/shop/cart', cartItemRoute);
app.use('/api/shop/address', addressRoute);
app.use('/api/shop/order', orderRoute);






const PORT = process.env.PORT || 5000;

app.listen(PORT, async ()=>{
    await Connection();
    console.log(`Server Started at PORT no: ${PORT}`);
})



