const express = require("express");
const { registerUser, loginUser, googleLogin } = require("../controllers/authController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google-login", googleLogin);

module.exports = router;
