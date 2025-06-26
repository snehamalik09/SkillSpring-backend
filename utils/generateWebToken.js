import jwt from 'jsonwebtoken'

export const generateWebToken = (res, user, message) => {
    console.log("key ",  process.env.SECRET_KEY);
    const token = jwt.sign({userId : user._id}, process.env.SECRET_KEY, {expiresIn : "1d"});
    return res.status(200).cookie("token", token, {
        httpOnly:true,  
        secure:true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",  

    }).json({
        success:true,
        message,
        user
    })
};