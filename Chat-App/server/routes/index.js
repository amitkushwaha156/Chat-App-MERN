const express = require("express");
const registerUser = require("../controller/registerUser");
const checkEmail = require("../controller/checkEmail");
const checkPassword = require("../controller/checkPassword");
const userDetails = require("../controller/userDetails");
const logout = require("../controller/logout");
const updateUserDetail = require("../controller/updateUserDetail");
const searchUser = require("../controller/searchUser");

const router = express.Router();
// create user api
router.post("/register", registerUser);
//check user email
router.post("/email", checkEmail);
//check user password
router.post("/password", checkPassword);

//login user details
router.get("/user-details", userDetails);
//logout user details

router.get("/logout", logout);

//update user details

router.post("/UpdateDetails", updateUserDetail);

//search user details
router.post("/search", searchUser)



module.exports = router;
