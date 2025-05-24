import mongoose from 'mongoose';
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim:true },
    email: { type: String, required: true, unique: true, lowercase: true, trim:true },
    password: { type: String, required: true, trim:true },
    role : {type:String, enum:["instructor", "student"], default:"student"},
    profilePhoto : {type:String, default:""},
    enrolledCourses : [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
        }
    ]
},{timestamps: true});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;