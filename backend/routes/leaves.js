import User from "../models/User.js";
import { sendLeaveRequestEmail } from "../services/email.js";
import express from "express";
import LeaveRequest from "../models/LeaveRequest.js";
import { auth, isAdmin } from "../middleware/auth.js";

const router = express.Router();


router.get("/mine", auth, async (req, res) => {
  try {
    const leaves = await LeaveRequest.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(leaves);
  } catch (err) {
    console.error("GET /leaves/mine error:", err);
    res.status(500).json({ message: err.message });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const { startDate, endDate, type, reason } = req.body;
    const leave = await LeaveRequest.create({
      user: req.user.id,
      startDate,
      endDate,
      type,
      reason,
    });

        const user = await User.findById(req.user.id);

    
    sendLeaveRequestEmail(leave, user).catch((err) =>
      console.error("Email error:", err.message)
    ); 

    res.status(201).json(leave);
  } catch (err) {
    console.error("POST /leaves error:", err);
    res.status(400).json({ message: err.message });
  }
});


router.get("/", auth, isAdmin, async (req, res) => {
  try {
    const leaves = await LeaveRequest.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(leaves);
  } catch (err) {
    console.error("GET /leaves (admin) error:", err);
    res.status(500).json({ message: err.message });
  }
});


router.patch("/:id/status", auth, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const leave = await LeaveRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("user", "name email");

    if (!leave) {
      return res.status(404).json({ message: "Leave not found" });
    }

    res.json(leave);
  } catch (err) {
    console.error("PATCH /leaves/:id/status error:", err);
    res.status(400).json({ message: err.message });
  }
});

export default router;
