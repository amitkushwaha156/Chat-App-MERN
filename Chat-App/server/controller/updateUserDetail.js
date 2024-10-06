const getUserDetailsFomToken = require("../helper/getuserDetailsFomToken");
const userModel = require("../models/UserModel");

async function updateUserDetail(req, res, next) {
  try {
    const token = req.cookies.token || "";

    const user = await getUserDetailsFomToken(token);
    const { name, profile_pic } = req.body;

    // Update user details
    const updatedUser = await userModel.findByIdAndUpdate(
      user._id,
      { name, profile_pic },
      { new: true, runValidators: true } // Return the updated document
    );

    return res.json({
      message: "User details updated successfully",
      user: updatedUser, // Return the updated user information
      error: false,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({
        error: true,
        message: "Error occurred while updating user details",
      });
  }
}

module.exports = updateUserDetail;
