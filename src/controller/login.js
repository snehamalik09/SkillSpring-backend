export const loginUser = async (req, res) => {
  try {
    console.log("Request received:", req.body); // ✅ Step 1

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      console.log("User not found");
      return res.status(400).json({
        success: false,
        message: "User not registered",
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      console.log("Incorrect password");
      return res.status(400).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    console.log("User authenticated, generating token");
    generateWebToken(res, user, `Welcome back, ${user.name}`);
  } catch (error) {
    console.error("Login error:", error); 
    return res.status(500).json({
      success: false,
      message: "error occured. failed to login",
    });
  }
};
