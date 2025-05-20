import User from '../models/User.model.js'
import bcrypt from 'bcryptjs'

export const register = async (req, res) => {
    try {
        const {name, email, password} = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required. Try again"
            })
        }

        const user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            name: name,
            email: email,
            password: hashedPassword
        })
        .then(() => { console.log("User created successfully !") })
        .catch(() => { console.log("User not created !") })

        return res.status(201).json({
            success: true,
            message: "User created successfully"
        })
    }

    catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Error occured. failed to register"
        })
    }
}




