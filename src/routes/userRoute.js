import express from "express";
import { register } from "../controller/register.js";
import { loginUser } from "../controller/login.js";
import {getEnrolledCourses, getUserDetails, updateProfile} from '../controller/getUserDetails.js';
import { getPublishedCourses } from "../controller/Course.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import { logout } from "../controller/logout.js";
import upload from "../../utils/multer.js";
import User from "../models/User.model.js";
import { SendEmail } from "../../utils/sendEmail.js";
import {rateLimit} from 'express-rate-limit';

const router = express.Router();
const emailLimiter = rateLimit({
  max:2,
  windowMs:60*60*1000,
  message: 'Message limit hit. Retry in 1 hour.',
  standardHeaders: true,
  legacyHeaders: false,
})

router.route('/register').post(register);
router.route('/courses').get(getPublishedCourses);
router.route('/enrolled-courses').get(isAuthenticated, getEnrolledCourses);
router.route('/login').post(loginUser);
router.route('/profile').get(isAuthenticated, getUserDetails);
router.route('/updateProfile').patch(isAuthenticated, upload.single("profilePhoto"), updateProfile);
router.route('/logout').get(logout);
router.route('/contact').post(emailLimiter, SendEmail);


router.get("/check-auth", isAuthenticated, async (req, res) => {
  const user = await User.findById(req.id).select("-password");
  return res.status(200).json({
    success: true,
    user
  });
});

export default router;

