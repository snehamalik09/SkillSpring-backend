import express from "express";
import crypto from 'crypto';
import razorpayInstance from "../controller/Razorpay.js";
import Course from "../models/Course.model.js";
import CoursePurchase from "../models/CoursePurchase.model.js";
import User from "../models/User.model.js";

export const createPaymentOrder = async (req, res) => {
    const{amount} = req.body;
    try {
        const options = {
            amount,
            currency: 'INR',
            notes:{
                courseId: req.body.courseId,
                amount:req.body.amount,
            }
        };

        const order = await razorpayInstance.orders.create(options);
        res.status(200).json(order);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating RazorPay order');
    }
}


export const verifyPayment = async (req, res) => {
    console.log("payment verification : ", req.body);
    const userId = req.id;

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
        .update(body)
        .digest("hex");

    if (expectedSignature === razorpay_signature) {
        try {

            const razorpayOrder = await razorpayInstance.orders.fetch(razorpay_order_id);
            const courseId = razorpayOrder.notes.courseId;
            const amount = razorpayOrder.notes.amount;


            const purchase = new CoursePurchase({
                course: courseId,
                user: userId,
                status: "completed",
                amount,
                paymentId: razorpay_payment_id
            })
            await purchase.save();

            await Course.findByIdAndUpdate(courseId, { $addToSet: { enrolledStudents: userId } });

            await User.findByIdAndUpdate(userId, { $addToSet: { enrolledCourses: courseId } });

            console.log("Enrollment successful");
            console.log("Payment verified successfully");
            return res.redirect(`${process.env.FRONTEND_URL}/paymentSuccess?reference=${razorpay_payment_id}`);
        }


        catch (error) {
            console.error("Payment verification failed : ", error);
            return res.status(400).json({
                success: false
            })
        }
    }

    else {
        console.log("Payment verification failed");
        return res.redirect(`${process.env.FRONTEND_URL}/paymentFailed?reference=${razorpay_payment_id}`);
    }
}
