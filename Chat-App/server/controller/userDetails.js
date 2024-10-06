const getUserDetailsFomToken = require("../helper/getuserDetailsFomToken");

async function userDetails(req, res) {
  try {
    const token = req.cookies.token || "";

    const user = await getUserDetailsFomToken(token);
    return res.status(200).json({
      message: "User details",
      data: user,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({
        error: true,
        message: "Error occurred while getting user details",
      });
  }
}

module.exports = userDetails;
