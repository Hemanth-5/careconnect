import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import cloudinary from "../config/cloudinary.js";

const handleGoogleLogin = async (accessToken, refreshToken, profile, done) => {
  try {
    // Ensure email is available in the profile
    const email =
      profile.emails && profile.emails[0] ? profile.emails[0].value : null;

    if (!email) {
      return done(null, false, {
        message: "No email associated with the Google account",
      });
    }

    // Find or create user based on Google ID
    let user = await User.findOne({ googleId: profile.id });

    if (!user) {
      // If user doesn't exist, create a new user
      user = new User({
        googleId: profile.id,
        username: profile.displayName,
        email: email, // Insert the email after ensuring it's not null
        // Generate a strong password (using googleId + secret as the password)
        password: await bcryptjs.hash(
          `${profile.id}${process.env.JWT_SECRET}`,
          10
        ),
        isProfileComplete: false,
      });

      console.log({ user });
      await user.save();
    }

    // Check if the profile picture exists, if not upload it to Cloudinary
    if (!user.profilePicture || !user.profilePictureUploadId) {
      const uploadResponse = await cloudinary.v2.uploader.upload(
        profile.photos[0].value,
        {
          folder: `careconnect/userProfiles/${user._id}`,
          public_id: `${user._id}_profile`,
          overwrite: true, // Ensures that previous image is overwritten
        }
      );

      user.profilePicture = uploadResponse.secure_url;
      user.profilePictureUploadId = uploadResponse.public_id;
      await user.save();
    }

    return done(null, user);
  } catch (err) {
    console.error("Google Login Error:", err);
    return done(err, false, { message: "Google login failed" });
  }
};

const refreshTokenHandler = (req, res) => {
  const { refreshToken } = req.body;
  // console.log({ refreshToken });

  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token required" });
  }

  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = jwt.sign(
      { id: decoded.id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.json({ accessToken: newAccessToken });
  });
};

export { handleGoogleLogin, refreshTokenHandler };
