import User from '../models/User.model.js';
import bcrypt from 'bcryptjs';
import { generateWebToken } from '../../utils/generateWebToken.js';
import jwt from 'jsonwebtoken'

export const login = async (req, res) => {
    try {
        console.log("request received : ", req.body);

        const {email, password} = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        const user = await User.findOne({ email });
        console.log("user founded is : ", user);

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User does not exists. Create an account"
            })
        }

        const passwordMatched = await bcrypt.compare(password, user.password);

        if(!passwordMatched) {
            return res.status(400).json({
                success: false,
                message: "Password incorrect. try again"
            })
        }

        generateWebToken(res, user, `Welcome back ${user.name}`);
    }

    catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "error occured. failed to login"
        })
    }
}

