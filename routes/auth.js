const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

router.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body;
  if (!username || !email || !password || !role)
    return res.status(400).json({ message: "Missing required fields" });

  const isExisting = await User.findOne({ email });
  if (isExisting) return res.status(409).json({ message: "User already exists." });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = new User({
    userId: uuidv4(),
    username,
    email,
    passwordHash,
    role
  });

  await user.save();
  res.status(201).json({ message: "User registered successfully", userId: user.userId });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Missing email or password." });

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "Invalid email or password." });

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ message: "Invalid email or password." });

  const token = jwt.sign({ userId: user.userId, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.status(200).json({ message: "Login successful", token, userId: user.userId, role: user.role });
});

module.exports = router;
