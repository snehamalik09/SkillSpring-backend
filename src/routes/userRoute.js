import express from "express";
import { register } from "../controller/register.js";
import { login } from "../controller/login.js";
import {getEnrolledCourses, getUserDetails, updateProfile} from '../controller/getUserDetails.js';
import { getPublishedCourses } from "../controller/Course.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import { logout } from "../controller/logout.js";
import upload from "../../utils/multer.js";
import User from "../models/User.model.js";

const router = express.Router();

router.route('/register').post(register);
router.route('/courses').get(getPublishedCourses);
router.route('/enrolled-courses').get(isAuthenticated, getEnrolledCourses);
router.route('/login').post(login);
router.route('/profile').get(isAuthenticated, getUserDetails);
router.route('/updateProfile').patch(isAuthenticated, upload.single("profilePhoto"), updateProfile);
router.route('/logout').get(logout);

router.get("/check-auth", isAuthenticated, async (req, res) => {
  const user = await User.findById(req.id).select("-password");
  return res.status(200).json({
    success: true,
    user
  });
});

export default router;

