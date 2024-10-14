import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import cloudinary from "../config/cloudinary.js";

const handleGoogleLogin = async (accessToken, refreshToken, profile, done) => {
  try {
    // Restrict domain
    const email = profile.emails[0].value;

    // Find or create user based on Google ID
    let user = await User.findOne({ googleId: profile.id });

    if (!user) {
      // If user doesn't exist, create a new user
      user = new User({
        googleId: profile.id,
        username: profile.displayName,
        email: email,
        // Generate a strong password
        password: await bcryptjs.hash(
          `${profile.id}${process.env.JWT_SECRET}`,
          10
        ),
        isProfileComplete: false,
      });
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

    // console.log(user);

    // Generate a new JWT token every time the user logs in using Google
    // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    //   expiresIn: "1d", // Token expires in 1 day
    // });

    // // console.log(token);

    // // If token is expired, regenerate using refresh token
    // const refreshJwtToken = jwt.sign(
    //   { id: user._id },
    //   process.env.JWT_REFRESH_SECRET,
    //   {
    //     expiresIn: "7d", // Optional: refresh token for longer expiration
    //   }
    // );

    // Send both access token and refresh token to the client
    return done(null, user);
  } catch (err) {
    console.error("Google Login Error:", err);
    return done(err, false, { message: "Google login failed" });
  }
};

export { handleGoogleLogin };
