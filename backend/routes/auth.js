require("dotenv").config();
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const secret = process.env.JWT_SECRET; // load it once here

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
 
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ userId: user._id, name: user.name, email: user.email }, secret, { expiresIn: "14d" });

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err });
  }
});

// PROTECTED USER INFO
router.get("/me", (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1]; // Bearer <token>

  try {
    const decoded = jwt.verify(token, secret);
    res.json({ user: decoded });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
});

module.exports = router;


// Add favorite site
router.post("/favorites", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Missing token" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, secret);
    const user = await User.findById(decoded.userId); // FIXED

    if (!user) return res.status(404).json({ message: "User not found" });

    const { site } = req.body;
    if (!site) return res.status(400).json({ message: "No site provided" });

    user.favorites.push(site);
    await user.save();

    res.status(200).json({ message: "Favorite added!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not add favorite", error: err.message });
  }
});


/*Save favorite site
router.post('/favorites', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const user = await User.findById(decoded.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { site } = req.body;
    if (!site) return res.status(400).json({ message: "No site provided" });

    if (!user.favorites) user.favorites = [];

    user.favorites.push(site);
    await user.save();

    res.status(200).json({ message: "Favorite saved!" });
  } catch (err) {
    console.error("Save Favorite Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});*/

// Get user's favorites
router.get('/favorites', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, secret);
    const user = await User.findById(decoded.userId); // FIXED

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ favorites: user.favorites });
  } catch (err) {
    console.error("Get Favorites Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// DELETE: Remove favorite place from user's favorites array
router.delete('/favorites', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Missing token" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, secret);
    const user = await User.findById(decoded.userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    const { lng, lat } = req.body;
    user.favorites = user.favorites.filter(fav => {
      const [favLng, favLat] = fav.geometry.coordinates;
      return !(favLng === lng && favLat === lat);
    });

    await user.save();
    res.status(200).json({ message: "Favorite removed successfully" });
  } catch (err) {
    console.error("Delete Favorite Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


