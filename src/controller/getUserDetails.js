import { deleteMediaFromCloudinary, uploadMediaToCloudinary } from '../../utils/cloudinary.js';
import User from '../models/User.model.js';
import Course from '../models/Course.model.js';

export const getUserDetails = async (req, res) => {
    try {

        const userId = req.id;

        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Result not found"
            })
        }

        return res.status(200).json({
            user,
            message: "User details found",
            success: true
        })
    }

    catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "error occured. Failed to fetch details"
        })
    }
}

export const updateProfile = async (req, res) => {
    try {
        console.log("entered in updateprofile fun");
        const userId = req.id;
        const { name } = req.body;
        const updatedProfilePhoto = req.file || null; 
        const updatedData = {};

        console.log("updated profile photo : ", updatedProfilePhoto);

        const existingUser = await User.findById(userId);

        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: "Result not found"
            })
        }


        if (updatedProfilePhoto) {
            //extract publicID of old image if it exists - first delete old image

            if (existingUser.profilePhoto) {
                const publicId = existingUser.profilePhoto.split("/").pop().split(".")[0];
                deleteMediaFromCloudinary(publicId);
            }

            //upload new profile photo
            const cloudinaryResponse = await uploadMediaToCloudinary(updatedProfilePhoto.path);
            console.log("cloudinary response : ", cloudinaryResponse);
            updatedData.profilePhoto = cloudinaryResponse.secure_url;
        }

        if (name && name != existingUser.name)
            updatedData.name = name;

        if (Object.keys(updatedData).length === 0) {
            return res.status(400).json({ success: false, message: "No changes detected in the profile" });
        }

        // Update only changed fields
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updatedData },
            { new: true, runValidators: true }
        );

        // new: true : Returns the updated document after applying changes.
        // runValidators: true : Ensures that Mongoose schema validations are applied when updating.

        return res.status(200).json({
            message: "User details updated successfully",
            success: true,
            updatedData,
            updatedUser
        })
    }

    catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Error occured in updating user profile details"
        })
    }
}

export const getEnrolledCourses = async (req, res) => {
    try {

        const userId = req.id;

        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        const courses=[];

        if(user.enrolledCourses.length>0){
            for(const courseId of user.enrolledCourses){
                const temp = await Course.findById(courseId).select('-lectures');
                courses.push(temp);
            }
        }

        return res.status(200).json({
            data:courses,
            message: "User course details found",
            success: true
        })
    }

    catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch user course details"
        })
    }
}


