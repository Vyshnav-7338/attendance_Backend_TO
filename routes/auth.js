// backend/routes/auth.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authenticate = require("../jwt");

// Registration
router.post("/users", authenticate, async (req, res) => {
  const adminId = req.userId;
  try {
    const { name, email, password } = req.body;
    const user = new User({
      name,
      email,
      password,
      adminId,
      phone,
      role: "user",
    });
    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login
router.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const role = user.role;

    const token = jwt.sign({ userId: user._id, role }, "KH_secret_key");

    res.status(200).json({ token, role });
  } catch (error) {
    console.error("Error in login:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});
// Route to create an Admin
router.post("/admin", authenticate, async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const admin = new User({ name, email, password, phone, role: "admin" });
    await admin.save();
    res.status(201).json({ message: "Admin created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route for admin to view the list of users they created
router.get("/admin/users", authenticate, async (req, res) => {
  try {
    const users = await User.find({ adminId: req.userId });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Route for super admin to view the list of admins
router.get("/superadmin/admins", authenticate, async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" });
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to delete an admin
router.delete("/admin/:id", authenticate, async (req, res) => {
  try {
    const admin = await User.findByIdAndDelete(req.params.id);
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }
    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/user/:id", authenticate, async (req, res) => {
  try {
    const admin = await User.findByIdAndDelete(req.params.id);
    if (!admin) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User Profile
router.get("/profile", authenticate, async (req, res) => {
  try {
    const userId = req.userId;
    console.log(userId);
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.json({ username: user.username });
  } catch (error) {
    res.status(500).send("Error fetching user profile");
  }
});

module.exports = router;
