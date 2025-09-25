const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

// ✅ Hardcoded admin credentials
const admin = {
  name: "Admin",
  email: process.env.ADMIN_EMAIL || "admin@dept.com",
  passwordHash: bcrypt.hashSync(process.env.ADMIN_PASS || "admin123", 10),
};

// ----------------- LOGIN -----------------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email !== admin.email)
      return res.status(400).json({ message: "Admin not found" });

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    res.status(200).json({
      message: "Login successful",
      admin: {
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ----------------- OPTIONAL REGISTER (disabled) -----------------
router.post("/register", (req, res) => {
  res.status(403).json({ message: "Admin registration is disabled" });
});

module.exports = router;
