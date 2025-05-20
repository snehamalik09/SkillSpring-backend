export const logout = async (_, res) => {
    try {

        res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0)
    });

        return res.status(200).json({
            success: true,
            message: "User logged out successfully"
        });
    }

    catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Error occured. Failed to logout"
        })
    }
}

