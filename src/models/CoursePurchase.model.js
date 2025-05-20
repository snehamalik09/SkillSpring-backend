import mongoose from 'mongoose';

const CoursePurchaseSchema = new mongoose.Schema({
    course:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Course",
        required:true
    },
    user : { 
        type:mongoose.Schema.Types.ObjectId, 
        ref:"User",
        required:true
    },
    status:{
        type:String,
        enum: ["pending", "completed", "failed"],
        default:"pending"
    },
    amount:{
        type:Number,
        required:true
    },
    paymentId:{
        type:String,
        required:true
    }

}, {timestamps:true})

const CoursePurchase = mongoose.model("CoursePurchase", CoursePurchaseSchema);
export default CoursePurchase;