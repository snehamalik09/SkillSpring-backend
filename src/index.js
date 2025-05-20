import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './database/db.js';
import userRouter from './routes/userRoute.js';
import courseRouter from './routes/courseRoute.js';
import cookieParser from 'cookie-parser';
import mediaRouter from './routes/mediaRoute.js';
import paymentRouter from './routes/paymentRoute.js';

dotenv.config({});
const app = express();

const PORT = process.env.PORT || 5000;

connectDB();


app.use(cors({
    origin: process.env.FRONTEND_URL, 
    credentials: true, 
}));

app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use('/api/user', userRouter);       
app.use('/api/admin', courseRouter);
app.use('/api/media', mediaRouter); 
app.use('/api/payment', paymentRouter); 


app.listen(PORT, ()=>{
    console.log("app is running at : ", PORT);
})