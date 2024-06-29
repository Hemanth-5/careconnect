import jwt from "jsonwebtoken";

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, type: user.type },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id, type: user.type },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "1d" }
  );
};

export { generateAccessToken, generateRefreshToken };
