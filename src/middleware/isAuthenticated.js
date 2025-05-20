import jwt from 'jsonwebtoken';

const isAuthenticated = async (req, res, next) => {
    try{
        const token = req.cookies.token;

        if(!token){
            res.status(401).json({
                message:"User authentication failed",
                success:false
            })
        }

        console.log("token is  ", token);

        const decode = jwt.verify(token,process.env.SECRET_KEY);
        if(!decode){
            res.status(401).json({
                message:"User authentication failed",
                success:false
            })
        }

        console.log("decoded");
        req.id = decode.userId;
        next();
    }

    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error occured. Failed to authenticate user"
        })
    }
}

export default isAuthenticated;