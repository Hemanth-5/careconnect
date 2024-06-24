import jwt from "jsonwebtoken";

const authenticateJWT = async (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    return res.status(401).json({ message: "Unauthorized access!" });
  }

  const token = authorizationHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden access!" });
    }

    req.user = user;
    next();
  });
};

export default authenticateJWT;
