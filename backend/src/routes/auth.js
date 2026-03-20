import express from "express";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail, findUserById, verifyPassword } from "../models/User.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    if (!email || !password || !name) {
      return res.status(400).json({ error: "All fields are required" });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }
    
    const user = await createUser({ email, password, name });
    
    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    
    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        memberSince: user.memberSince
      }
    });
  } catch (error) {
    console.error("Registration error:", error);
    if (error.message === "Email already registered") {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: "Server error during registration" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    
    const isValid = await verifyPassword(user, password);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    
    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    
    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        memberSince: user.memberSince
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error during login" });
  }
});

// Get current user info (for token validation)
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const user = await findUserById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.json({
      id: user._id,
      email: user.email,
      name: user.name,
      memberSince: user.memberSince
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user data" });
  }
});

export default router;