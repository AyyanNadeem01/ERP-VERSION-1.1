require('dotenv').config(); // Make sure env variables are loaded

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "someSuperSecretKey";

exports.signup = async (req, res) => {
  const { userId, password } = req.body;

  try {
    // Check if user exists
    const existingUser = await User.findOne({ id: userId });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    const user = new User({ id: userId, password: hashedPassword });
    await user.save();

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id }, // payload
      JWT_SECRET,           // secret key
      { expiresIn: "30d" }   // token expiry
    );

    res.json({ message: "Signup successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
};

exports.login = async (req, res) => {
  const { userId, password } = req.body;

  try {
    const user = await User.findOne({ id: userId });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user._id }, // payload
      JWT_SECRET,           // secret key
      { expiresIn: "30d" }
    );

    res.json({ message: "Login successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
};
