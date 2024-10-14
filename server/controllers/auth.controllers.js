import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import cloudinary from "../config/cloudinary.js";

// const login = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: "User not found" });
//     }

//     const validPassword = await bcryptjs.compare(password, user.password);
//     if (!validPassword) {
//       return res.status(400).json({ message: "Invalid password" });
//     }

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "1d",
//     });

//     res.status(200).json({ token });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// const initialRegister = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const userExists = await User.findOne({ email });
//     if (userExists) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     const hashedPassword = await bcryptjs.hash(password, 10);
//     const user = new User({
//       email,
//       password: hashedPassword,
//       username: `user${Math.floor(Math.random() * 1000000)}`,
//     });

//     await user.save();

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "1d",
//     });

//     res.status(200).json({ token });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// const completeRegistration = async (req, res) => {
//   const { name, role, department, bio, profilePicture, interests } = req.body;

//   try {
//     const user = await User.findById(req.user.id);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     await User.findByIdAndUpdate(
//       user._id,
//       {
//         name,
//         role,
//         department,
//         bio,
//         profilePicture,
//         interests,
//         isProfileComplete: true,
//       },
//       { new: true }
//     );

//     res.status(200).json({ message: "Profile updated successfully" });
//   } catch (error) {
//     res.status(500).json({ error });
//   }
// };

const handleGoogleLogin = async (accessToken, refreshToken, profile, done) => {
  try {
    // Restrict domain
    const email = profile.emails[0].value;
    // if (!email.endsWith("@psgtech.ac.in")) {
    //   return done(null, false, {
    //     message: "Only PSG Tech email addresses are allowed",
    //   });
    // }

    // Find or create user based on Google ID
    let user = await User.findOne({ googleId: profile.id });

    if (!user) {
      // If user doesn't exist, create a new user
      user = new User({
        googleId: profile.id,
        username: profile.displayName,
        contactInfo: { email },
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
