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


const allowedOrigins = ['http://localhost:5173', 'https://skillspring-frontend.vercel.app'];

// CORS setup with dynamic origin
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      // Allow requests with no origin (e.g., mobile apps, Postman)
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS")); // Reject other origins
    }
  },
  credentials: true, // Allow credentials like cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow these HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'], // Allow these headers in requests
  exposedHeaders: ['set-cookie'], // Allow clients to access these headers
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