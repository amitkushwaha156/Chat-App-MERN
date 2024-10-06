const userModel = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

async function checkPassword(req, res) {
  try {
    const { password, userId } = req.body;

    // Check if userId is provided
    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
        error: true,
      });
    }

    // Retrieve the user from the database
    const user = await userModel.findById(userId);

    // Check if user exists
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        error: true,
      });
    }

    // Check if the password is valid
    const matchPassword = await bcrypt.compare(password, user.password);

    if (!matchPassword) {
      return res.status(400).json({
        message: "Invalid Password",
        error: true,
      });
    }

    // Generate a JWT token
    const tokenData = {
      id: user._id,
      email: user.email,
    };

    const token = await jwt.sign(tokenData, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });

    // Configure cookie options
    const cookiesOption = {
      httpOnly: true, // Corrected from 'http' to 'httpOnly'
      secure: process.env.NODE_ENV === "production", // Set secure based on environment
      sameSite: "Strict", // Optional, depending on your requirements
    };

    // Send the token in a cookie and respond
    return res.cookie("token", token, cookiesOption).status(200).json({
      message: "Login successful",
      token: token,
      success: true,
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res.status(500).json({
      message: "Server Error",
    });
  }
}

module.exports = checkPassword;
