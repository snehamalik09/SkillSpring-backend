import express from "express";
import isAuthenticated from "../middleware/isAuthenticated.js";
import { createPaymentOrder, verifyPayment } from "../controller/Payment.js";

const router = express.Router();

router.post('/create-order', isAuthenticated, createPaymentOrder);
router.post('/paymentVerification', isAuthenticated, verifyPayment);

export default router;