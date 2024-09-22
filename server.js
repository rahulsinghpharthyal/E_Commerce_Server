import dotenv from "dotenv";
dotenv.config({path: 'config/.env'});
// import { configDotenv } from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';

import cors from 'cors';
import Connection from './database/databaseConnection.js';
// if (process.env.NODE_ENV !== "production") {
//     configDotenv({
//       path: "config/.env",
//     });
//   }
  
console.log('PAYPAL_MODE:', process.env.PAYPAL_MODE);
import trackAPIUsage from './middleware/trackAPIUsage.js';
import loggingMiddleware from './middleware/loggingRequest.js';


const app = express();

app.use(
    cors({
        origin: ['http://localhost:5173', 'https://main--dummycommerce.netlify.app/', 'https://dummycommerce.netlify.app/'],
        methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
        withCredentials: true,
        credentials: true,
    })
);

app.use(cookieParser());
app.use(express.json());
app.use(trackAPIUsage);
app.use(loggingMiddleware); 

// -------------------------Routes---------------------------------
import authRouter from './routes/auth_route.js';
import adminProductRoute from './routes/admin/products_route.js';
import getFilteredProducts from './routes/shop/filterProductsRoute.js';
import cartItemRoute from './routes/shop/cartItemRoute.js';
import addressRoute from './routes/shop/addressRoute.js'
import orderRoute from './routes/shop/orderRoute.js';

import apiUsageRoute from './routes/apiUsage/apiUsageRoute.js';
import passwordRecoveryRouter from './routes/passwordRecover/passwrodRecoveryRoute.js';
import logRoute from './routes/admin/logRoute.js';

app.use('/api/auth', authRouter);
app.use('/api/admin/products', adminProductRoute);
app.use('/api/admin', apiUsageRoute);
app.use('/api/admin', logRoute);

// ------shoping----------------
app.use('/api/shop/products', getFilteredProducts);
app.use('/api/shop/cart', cartItemRoute);
app.use('/api/shop/address', addressRoute);
app.use('/api/shop/order', orderRoute);


app.use('/api/recover', passwordRecoveryRouter);



const PORT = process.env.PORT || 5000;

app.listen(PORT, async ()=>{
    await Connection();
    console.log(`Server Started at PORT no: ${PORT}`);
})



