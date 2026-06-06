import User from "../models/userModel.js"
import {generateTokens, setCookies} from "../lib/generateToken.js";
import jwt from "jsonwebtoken";
// ======================================================
// REGISTER USER
// ======================================================

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, } = req.body;

    // VALIDATION
    if (!name || !email || !password ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // CHECK EXISTING USER
    const userExists = await User.findOne({
      email: normalizedEmail,
    });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // CREATE USER
    const user = await User.create({
      name,
      email: normalizedEmail,
      password,
    });

    await user.save();

    return res.status(201).json({
      success: true,
      message:
        "Account created",
    });

  } catch (error) {
    console.log("Register error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ======================================================
// LOGIN USER
// ======================================================

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // VALIDATION
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const normalizedEmail = email
      .toLowerCase()
      .trim();

    // FIND USER
    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // PASSWORD CHECK
    const isMatch =
      await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }


    // GENERATE TOKENS
    const {
      accessToken,
      refreshToken,
    } = await generateTokens(user._id);

    // SET COOKIES
    setCookies(
      res,
      accessToken,
      refreshToken
    );

    const safeUser = user.toObject();
    delete safeUser.password;

    return res.status(200).json({
      success: true,
      user: safeUser,
      accessToken,
    });

  } catch (error) {
    console.log("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ======================================================
// LOGOUT USER
// ======================================================

export const logoutUser = async (req, res) => {
  try {
    // CLEAR ACCESS TOKEN COOKIE
    res.clearCookie("accessToken", {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "development" ? "lax": "none",
      secure:
        process.env.NODE_ENV === "production",
    });

    // CLEAR REFRESH TOKEN COOKIE
    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "development" ? "lax": "none",
      secure:
        process.env.NODE_ENV === "production",
    });

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });

  } catch (error) {
    console.log("Logout error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ======================================================
// REFRESH ACCESS TOKEN
// ======================================================

export const refresh_token = async (
  req,
  res
) => {
  try {
    const refreshToken =
      req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message:
          "No refresh token provided",
      });
    }

    // VERIFY TOKEN
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    // CREATE NEW ACCESS TOKEN
    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "15m",
      }
    );

    // SET NEW ACCESS TOKEN COOKIE
    res.cookie(
      "accessToken",
      accessToken,
      {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "development" ? "lax": "none",
        secure:
          process.env.NODE_ENV ===
          "production",
        maxAge: 15 * 60 * 1000,
      }
    );

    return res.status(200).json({
      success: true,
      message:
        "Access token refreshed",
    });

  } catch (error) {
    console.log(
      "Refresh token error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ======================================================
// GET USER PROFILE
// ======================================================

export const getUserProfile = async (
  req,
  res
) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(
      userId
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json(user);

  } catch (error) {
    console.log(
      "Get profile error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
