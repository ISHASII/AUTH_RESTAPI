import express from "express";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
import User from "../models/User.js";

router.get("/profile", protect, (req, res) => {
  res.json({
    message: "Data yang dilindungi",
    user: req.user,
  });
});

router.get("/list", protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find({}, "username").skip(skip).limit(limit),
      User.countDocuments(),
    ]);

    res.json({
      users,
      total,
      page,
      limit,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.post("/profile", protect, (req, res) => {
  res.json({
    message: "Data yang dilindungi",
    user: req.user,
  });
});

router.put("/:id", protect, async (req, res) => {
  try {
    const { id } = req.params;
    if (req.user.id !== id) {
      return res
        .status(403)
        .json({ message: "Tidak berhak mengubah user lain" });
    }

    const updates = {};
    if (req.body.username) updates.username = req.body.username;
    if (req.body.password) {
      const bcrypt = await import("bcryptjs");
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(req.body.password, salt);
    }

    const user = await User.findByIdAndUpdate(id, updates, {
      new: true,
      select: "-password",
    });
    res.json({ message: "User diupdate", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan saat mengubah user" });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    const { id } = req.params;
    if (req.user.id !== id) {
      return res
        .status(403)
        .json({ message: "Tidak berhak menghapus user lain" });
    }
    await User.findByIdAndDelete(id);
    res.json({ message: "User berhasil dihapus" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan saat menghapus user" });
  }
});

export default router;
