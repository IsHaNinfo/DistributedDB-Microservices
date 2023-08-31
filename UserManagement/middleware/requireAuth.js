const jwt = require("jsonwebtoken");
const User = require("../controllers/UserController");

const requireAuth = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Authorization token required" });
  }

  const token = authorization.split(" ")[1];

  try {
    const { _id } = jwt.verify(token, process.env.SECRET);
    req.user = await User.findOne({ _id }).select("_id");
    req._id = req.user._id;
    next();
  } catch (error) {
    console.log(error);
    if (error.name === "TokenExpiredError") {
      return res.redirect("/login");
    }
    res.status(401).json({ error: "Request is not authorized" });
  }
};


const userAuth = async (token) => {
  try {
    const { _id } = jwt.verify(token, process.env.SECRET);
    const user = await User.findOne({ _id }).select("_id");

    if (!user) {
      return "User not found";
    }

    return user._id;
  } catch (error) {
    // console.error(error);

    if (error.name === "TokenExpiredError") {
      return "Token is expired";
    }

    return "Authentication failed"; // Default error message for other errors
  }
};


module.exports = {
  requireAuth, userAuth
};

