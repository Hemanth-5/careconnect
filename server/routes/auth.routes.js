import jwt from "jsonwebtoken";
import express from "express";
import passport from "passport";

const router = express.Router();

// Route for Google authentication
router
  .route("/google")
  .get(passport.authenticate("google", { scope: ["profile", "email"] }));

// Callback route after Google authentication
router.route("/google/callback").get(
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.GOOGLE_FAILURE_REDIRECT}?error=google-auth&type=domain`,
  }),
  (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Invalid domain" });
    }

    // console.log(req.user);
    // Create access token
    const accessToken = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h", // Access token valid for 1 hour
    });

    // console.log({ accessToken });

    // Create refresh token
    const refreshToken = jwt.sign(
      { id: req.user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d", // Refresh token valid for 7 days
      }
    );

    // console.log({ refreshToken });

    // Store refresh token in the database if needed

    // Redirect to frontend with tokens
    res.redirect(
      `${process.env.GOOGLE_SUCCESS_REDIRECT}?accessToken=${accessToken}&refreshToken=${refreshToken}`
    );
  }
);

export default router;
