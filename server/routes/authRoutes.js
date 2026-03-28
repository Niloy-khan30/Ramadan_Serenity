const express = require("express");
const { googleLogin, getProfile } = require("../controllers/authController");

const router = express.Router();

router.post("/google", googleLogin);
router.get("/profile/:email", getProfile);

module.exports = router;