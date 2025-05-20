import express from "express";
import upload from "../../utils/multer.js";
import {uploadMediaToCloudinary} from "../../utils/cloudinary.js";

const router = express.Router();

router.route("/upload-video").post(upload.single("file"), async(req, res) => {
    try{
        const result = await uploadMediaToCloudinary(req.file.path);
        res.status(200).json({
            success:true,
            message:"File/video uploaded successfully",
            data : result
        })
    }
    catch(err){
        console.error(err);
        res.status(500).json({
            success:false,
            message:"Error uploading file/video",
        })
    }
});

export default router;
