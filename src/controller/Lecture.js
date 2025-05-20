import Lecture from '../models/Lecture.model.js';
import Course from '../models/Course.model.js';
// import {deleteMediaFromCloudinary} from '../../utils/cloudinary.js';



export const createLecture = async (req,res) => {
    try{
        
        const lectureTitle = req.body?.title;
        const courseId = req.params.courseId;

        console.log("lecture title : ", lectureTitle);
        console.log("course id : ", courseId);

        if(!lectureTitle || !courseId){
            return res.status(400).json({
                success:false,
                message:"Missing mandatory fields"
            })
        }

        const lecture = await Lecture.create({ lectureTitle });
        const existingCourse = await Course.findById(courseId);

        if(!(existingCourse)){
            return res.status(500).json({
                success:false,
                message:"Error occured Course not found!"
            })
        }

        await Course.findByIdAndUpdate(
            courseId,
            { $push: { lectures: lecture._id } },
            { new: true }
          );
          

        return res.status(201).json({
            success:true,
            message:"Lecture created successfully"
        })
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"Error occured in creating the lecture"
        })
    }
}
export const updateLecture = async (req, res) => {
    try {
      const { lectureId } = req.params;
      const updateData = req.body.lectureDetails;  
      console.log("lec data : ", updateData);
  
      if (!lectureId) {
        return res.status(400).json({
          success: false,
          message: "Lecture ID is required"
        });
      }
  
      if (!updateData || Object.keys(updateData).length === 0) {
        return res.status(400).json({
          success: false,
          message: "No update data provided"
        });
      }
  
      const updatedLecture = await Lecture.findByIdAndUpdate(
        lectureId,
        { $set: updateData },
        { new: true, runValidators: true }
      );
  
      if (!updatedLecture) {
        return res.status(404).json({
          success: false,
          message: "Lecture not found"
        });
      }
  
      return res.status(200).json({
        success: true,
        data: updatedLecture
      });
    } catch (err) {
      console.error("Update error:", err);
      return res.status(500).json({
        success: false,
        message: err.message || "Error updating lecture"
      });
    }
  }

export const getLectureById = async (req,res) => {
    try{
        const lectureId = req.params.lectureId;

        const existingLecture = await Lecture.findById(lectureId);

        if(!existingLecture){
            return res.status(404).json({
                success:false,
                message:"Lecture not found"
            })
        }

        return res.status(200).json({
            success:true,
            message:"Lecture fetched successfully",
            data:existingLecture
        })
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"Error occured in fetching the lecture"
        })
    }
}

export const getLecture = async (req,res) => {
    try{
        const courseId = req.params.courseId;
        const lectureDetails=[];

        const existingCourse = await Course.findById(courseId);

        if(!existingCourse){
            return res.status(404).json({
                success:false,
                message:"Course not found"
            })
        }

        for(const lectureId of existingCourse.lectures){
            const details = await Lecture.findById(lectureId);
            if(details)
                lectureDetails.push(details);
        }

        return res.status(200).json({
            success:true,
            message:"Lectures fetched successfully",
            lectures:lectureDetails
        })
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"Error occured in fetching the lecture"
        })
    }
}


export const removeLecture = async (req,res) => {
    try{
        const lectureId = req.params.lectureId;

        const existingLecture = await Lecture.findById(lectureId);

        if(!existingLecture){
            return res.status(404).json({
                success:false,
                message:"Lecture not found"
            })
        }

        // if (existingLecture.publicId) {
        //     try {
        //         await deleteMediaFromCloudinary(existingLecture.publicId);
        //     } 
        //     catch (cloudinaryError) {
        //         console.error("Cloudinary deletion error:", cloudinaryError);
        //     }
        // }

        // await Lecture.findByIdAndDelete(lectureId);

        // await Course.updateOne({lectures:lectureId}, {$pull:{lectures:lectureId}});

        return res.status(200).json({
            success:true,
            message:"Lecture removed successfully",
        })
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"Error occured in removing the lecture"
        })
    }
}




