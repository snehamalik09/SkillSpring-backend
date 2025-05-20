import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

export const uploadMediaToCloudinary = async (file) => {
    try {
        const uploadResponse = await cloudinary.uploader.upload(file, { resource_type: "auto" });
        return uploadResponse;
    }

    catch (err) {
        console.log(err);
    }
}

export const deleteMediaFromCloudinary = async (publicID) => {
    try {
        const deleteResponse = await cloudinary.uploader.destroy(publicID, { resource_type: "auto" });
        return deleteResponse;
    } catch (err) {
        console.error("Cloudinary delete error:", err);
        throw err;
    }
};




export const deleteVideoFromCloudinary = async (publicID) => {
    try {
        cloudinary.uploader
            .destroy(publicID, { resource_type: 'video' })
            .then(result => console.log(result));
    } catch (err) {
        console.error("Cloudinary delete error:", err);
        throw err;
    }
};


