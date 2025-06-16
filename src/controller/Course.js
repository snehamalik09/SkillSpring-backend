import Course from '../models/Course.model.js';
import { deleteMediaFromCloudinary, uploadMediaToCloudinary } from '../../utils/cloudinary.js';


export const createCourse = async (req, res) => {
    try {
        console.log("request received : ", req.body);
        const title = req.body?.title;
        const category = req.body?.category;
        const price = req.body?.price || 0;

        if (!title || !category) {
            return res.status(400).json({
                success: false,
                message: "Missing title or category in the course"
            })
        }

        const courseCreated = await Course.create({
            courseTitle: title,
            coursePrice: price,
            category,
            creator: req.id,
        })

        console.log("created course : ", courseCreated);

        return res.status(201).json({
            success: true,
            message: "Course created successfully"
        })
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error occured in creating the course"
        })
    }

}


export const getCoursesByCreator = async (req, res) => {
    try {

        const creatorId = req.id;

        const allCourses = await Course.find({ creator: creatorId });

        console.log("All courses created by the instructor : ", allCourses);

        return res.status(200).json({
            success: true,
            message: "Courses fetched successfully",
            courses: allCourses
        })
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error occured in fetching the course"
        })
    }
}

export const getCourseById = async (req, res) => {
    try {
        const courseId = req.params.courseId;

        const courseDetails = await Course.findById(courseId);

        return res.status(200).json({
            success: true,
            message: "Course fetched successfully",
            course: courseDetails
        })
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error occured in fetching the course"
        })
    }
}

export const getPublishedCourses = async (req, res) => {
    try {
        const { isPublished } = req.query;
        console.log("Incoming query param isPublished:", isPublished);
        let query = {};
        if (isPublished==='true') {
            query.isPublished = true;
        }

        console.log("Final query object:", query);

        const courses = await Course.find(query).sort({ createdAt: -1 });

        console.log("Fetched courses:", courses);

        return res.status(200).json({
            success: true,
            message: "Courses fetched successfully",
            data: courses
        })
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error occured in fetching the courses"
        })
    }
}

export const updateCourseById = async (req, res) => {
    try {

        const data = req.body;
        const courseId = req.params.courseId;
        const courseThumbnail = req.file || null;

        console.log("Curse id : ", courseId);
        console.log("input data of course received in backend : ", data);

        if (!data.courseTitle || !data.category) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            })
        }

        const existingCourse = await Course.findById(courseId);
        if (!existingCourse) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            })
        }

        if (courseThumbnail) {
            //extract publicID of old image if it exists - first delete old image

            if (existingCourse.courseThumbnail) {
                const publicId = existingCourse.courseThumbnail.split("/").pop().split(".")[0];
                deleteMediaFromCloudinary(publicId);
            }

            //upload new profile photo
            const cloudinaryResponse = await uploadMediaToCloudinary(courseThumbnail.path);
            console.log("cloudinary response : ", cloudinaryResponse);
            data.courseThumbnail = cloudinaryResponse.secure_url;
        }

        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            { $set: data },
            { new: true }
        );

        console.log("updated course : ", updatedCourse);

        return res.status(201).json({
            success: true,
            message: "Course created successfully"
        })
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error occured in updating the course"
        })
    }

}

export const deleteCourseById = async (req, res) => {
    try {

        const courseId = req.params.courseId;

        const deletedCourse = await Course.findByIdAndDelete(courseId);
        if (!deletedCourse) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            })
        }

        console.log("deleted course : ", deletedCourse);

        return res.status(201).json({
            success: true,
            message: "Course deleted successfully"
        })
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong while deleting the course",
        })
    }

}


export const togglePublishCourse = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const publish = req.query.publish === 'true';

        const existingCourse = await Course.findById(courseId);
        if (!existingCourse) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            })
        }

        await Course.findByIdAndUpdate(courseId, { $set: { isPublished: publish } }, { new: true });

        const statusMessage = publish ? "published" : "Unpublished";
        console.log("statusMessage : ", statusMessage);

        return res.status(201).json({
            success: true,
            message: `Course is ${statusMessage} successfully`
        })
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error occured while publishing/unpublishing"
        })
    }

}


export const searchCourse = async (req, res) => {
    try {
        const {query = "", categories=[], sortByPrice} = req.query;

        const searchCriteria = {
            isPublished:true,
            $or : [
                {courseTitle: {$regex:query, $options:"i"}},
                {description: {$regex:query, $options:"i"}},
                {category: {$regex:query, $options:"i"}},
            ]
        }

        if(categories.length>0)
            searchCriteria.category = {$in:categories}


        const sortOptions = {};

        if(sortByPrice=="low")
            sortOptions.coursePrice = 1;

        else if(sortByPrice=="high")
            sortOptions.coursePrice = -1;

        let courses = await Course.find(searchCriteria).populate({path:"creator", select:"name profilePhoto"}).sort(sortOptions);

        return res.status(200).json({
            success: true,
            message: `Courses fetched successfully`,
            courses:courses || []
        })
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error occured while fetching courses"
        })
    }

}




