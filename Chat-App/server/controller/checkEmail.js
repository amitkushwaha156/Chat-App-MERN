const userModel = require("../models/UserModel");

async function checkEmail(req, res) {
  try {
    const { email } = req.body;
    const existingUser = await userModel.findOne({ email });

    if (!existingUser) {
      return res
        .status(400)
        .json({
          error: true,
          message: "Email already exists",
          data: existingUser,
        });
    } else {
      return res
        .status(200)
        .json({ error: false,
           message: "Email is Verified", 
           data: existingUser,
           success: true });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: true, message: "Error occurred while checking email" });
  }
}

module.exports = checkEmail;
