const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid"); // ✅ UUID for userId

// SIGNUP
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create new user with userId
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      userId: uuidv4(), // ✅ generate and store userId
    });

    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      userId: newUser.userId, // ✅ send back userId to frontend
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "User not found" });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // ✅ Return userId (not full user)
    res.status(200).json({
      message: "Login successful",
      userId: user.userId, // ✅ send this to store in localStorage
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
