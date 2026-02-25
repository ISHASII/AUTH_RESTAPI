import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username dan password wajib diisi" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username sudah terdaftar" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User berhasil didaftarkan",
      user: { id: user._id, username: user.username },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server mengalami error", error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username dan password wajib diisi" });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: "User tidak ditemukan" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Password salah" });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.json({
      message: "Login berhasil",
      token,
      user: { id: user._id, username: user.username },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server mengalami error", error: error.message });
  }
});

export default router;
