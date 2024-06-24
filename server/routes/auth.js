import express from "express";
import { OAuth2Client } from "google-auth-library";

const router = express.Router();
const client = new OAuth2Client(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET
);

router.get("/google", async (_, res) => {
  // Remove unused 'req' parameter
  try {
    const url = getGoogleAuthUrl(); // Function to generate Google OAuth URL
    res.json({ url });
  } catch (error) {
    console.error("Error generating Google OAuth URL:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const getGoogleAuthUrl = () => {
  const redirectUri = "http://localhost:5001/api/auth/google/callback"; // Replace with your frontend redirect URI
  const scopes = ["https://www.googleapis.com/auth/userinfo.email"];

  const authUrl = client.generateAuthUrl({
    // Replace 'oAuth2Client' with 'client'
    access_type: "offline",
    scope: scopes,
    redirect_uri: process.env.REDIRECT_URI || redirectUri,
  });

  return authUrl;
};
router.get("/google/callback", async (req, res) => {
  // Handle callback after user grants permission
  const { code } = req.query;
  try {
    const tokenResponse = await client.getToken(code); // Replace 'oAuth2Client' with 'client'
    // Remove unused 'tokens' variable
    // Handle tokens, e.g., store them in the session or database
    res.redirect("/dashboard"); // Redirect to dashboard or desired page
  } catch (error) {
    console.error("Error exchanging code for tokens:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
