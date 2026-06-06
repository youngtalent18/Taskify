import User from "../models/userModel.js"
import jwt from "jsonwebtoken"

export const protectRoute = async ( req,res, next) => {
  try {
    const accessToken =
      req.cookies.accessToken;

    if (!accessToken) {
      return res.status(401).json({
        error:
          "Unauthorized - no token",
      });
    }

    const decoded = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET
    );

    const user = await User.findById(
      decoded.userId
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    req.user = user;

    next();

  } catch (error) {
    console.log(
      "Protect route error:",
      error
    );

    return res.status(401).json({
      error: "Unauthorized",
    });
  }
};

export default protectRoute;