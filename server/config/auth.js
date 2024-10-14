import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user.model.js";

import dotenv from "dotenv";
import { handleGoogleLogin } from "../controllers/auth.controllers.js";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID.toString(),
      clientSecret: process.env.GOOGLE_CLIENT_SECRET.toString(),
      callbackURL: process.env.GOOGLE_CALLBACK_URL.toString(),
    },
    handleGoogleLogin
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
