import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import Connection from './database/databaseConnection.js';
dotenv.config({path: './config/.env'});

const app = express();

const allowedOrigins = ['http://localhost:5173', 'https://dummycommerce.netlify.app'];

app.use(
    cors({
        origin: function (origin, callback) {
            // Allow requests with no origin (like mobile apps or Postman) or if origin is in the allowedOrigins
            if (!origin || allowedOrigins.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
        credentials: true, // Allow credentials such as cookies, authorization headers
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



