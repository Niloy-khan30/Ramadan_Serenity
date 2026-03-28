const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: "Google credential is required",
      });
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      return res.status(401).json({
        success: false,
        message: "Invalid Google token",
      });
    }

    const { sub, name, email, picture, email_verified } = payload;

    if (!email_verified) {
      return res.status(401).json({
        success: false,
        message: "Google email is not verified",
      });
    }

    let user = await User.findOne({ email });

    if (user) {
      user.googleId = sub;
      user.name = name;
      user.picture = picture;
      user.lastLogin = new Date();
      await user.save();
    } else {
      user = await User.create({
        googleId: sub,
        name,
        email,
        picture,
        provider: "google",
        lastLogin: new Date(),
      });
    }

    return res.status(200).json({
      success: true,
      message: "Google login successful",
      user: {
        _id: user._id,
        googleId: user.googleId,
        name: user.name,
        email: user.email,
        picture: user.picture,
        provider: user.provider,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    console.error("Google login error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Authentication failed",
      error: error.message,
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const { email } = req.params;

    const user = await User.findOne({ email }).select("-__v");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get profile error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to get user profile",
      error: error.message,
    });
  }
};

module.exports = {
  googleLogin,
  getProfile,
};