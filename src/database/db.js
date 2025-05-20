import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;
        await mongoose.connect(mongoUri);
        console.log("Mongodb connection successfull")    
    }
    catch (err) {
        console.log("Mongodb not connected");
    }
}

export default connectDB;