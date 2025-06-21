import express from "express";
import isAuthenticated from "../middleware/isAuthenticated.js";
import {createCourse, getCoursesByCreator, getPurchasedCoursesOfCreator, getCourseById, updateCourseById, deleteCourseById, togglePublishCourse, searchCourse} from '../controller/Course.js';
import {createLecture, getLecture, updateLecture, getLectureById, removeLecture} from '../controller/Lecture.js';
import upload from "../../utils/multer.js";

const router = express.Router();

router.route("/create").post(isAuthenticated, createCourse);
router.route("/courses").get(isAuthenticated, getCoursesByCreator);
router.route("/purchasedCourses").get(isAuthenticated, getPurchasedCoursesOfCreator);
router.route("/search").get(isAuthenticated, searchCourse);
router.route("/course/:courseId").get(isAuthenticated, getCourseById);
router.route("/course/:courseId").put(isAuthenticated, togglePublishCourse);
router.route("/course/:courseId/update").put(isAuthenticated, upload.single("courseThumbnail"),updateCourseById);
router.route("/course/:courseId/delete").delete(isAuthenticated, deleteCourseById);
router.route("/course/:courseId/lecture").post(isAuthenticated, createLecture);
router.route("/course/:courseId/lecture").get(isAuthenticated, getLecture);
router.route("/course/:courseId/lecture/:lectureId").get(isAuthenticated, getLectureById);
router.route("/course/:courseId/lecture/:lectureId").post(isAuthenticated, updateLecture);
router.route("/course/:courseId/lecture/:lectureId").delete(isAuthenticated, removeLecture);

export default router;
