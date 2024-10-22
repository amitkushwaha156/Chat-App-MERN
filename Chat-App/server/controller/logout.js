async function logout(req, res) {
    try {
      const cookiesOption = {
        httpOnly: true, // Ensures the cookie is not accessible via JavaScript
        secure: process.env.NODE_ENV === "production", // Set to true only in production
        sameSite: "Strict", // Optional, for added security
      };
  
      // Clear the cookie by setting it to an empty value and past date
      return res
        .cookie("token", "", { ...cookiesOption, expires: new Date(0) }) // Set expires to a past date
        .status(200)
        .json({
          message: "Logged out successfully",
          success: true,
          data: null,
          error: false,
        });
    } catch (error) {
      console.error(error); // Log the error for debugging
      return res.status(500).json({
        message: "Server Error",
        error: true,
      });
    }
  }
  
  module.exports = logout;
  