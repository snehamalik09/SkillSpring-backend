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


const allowedOrigins = [process.env.FRONTEND_URL];

// CORS setup with dynamic origin
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS")); 
    }
  },
  credentials: true, 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  exposedHeaders: ['set-cookie'], 
}));


console.log('Allowed CORS Origin:', process.env.FRONTEND_URL);

app.use((req, res, next) => {
  console.log('Incoming request from:', req.headers.origin);
  next();
});

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