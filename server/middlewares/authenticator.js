import jwt from "jsonwebtoken";

// Middleware to authenticate the JWT token
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

// Middleware to check if the user is an admin
const authenticateAdmin = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  console.log(user.roles);
  if (!user.roles.includes("admin")) {
    return res.status(403).json({ message: "Forbidden" });
  }

  next();
};

export { authenticateJWT, authenticateAdmin };
