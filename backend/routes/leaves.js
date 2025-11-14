
import express from "express";
import LeaveRequest from "../models/LeaveRequest.js";
import User from "../models/User.js";
import { auth, isAdmin } from "../middleware/auth.js";
import { sendLeaveRequestEmail } from "../services/email.js";

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

    
    try {
      const user = await User.findById(req.user.id);
      await sendLeaveRequestEmail(leave, user);
    } catch (emailErr) {
      console.error("Error sending leave request email:", emailErr.message);
    }

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


router.patch("/:id", auth, async (req, res) => {
  try {
    const leave = await LeaveRequest.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({ message: "Leave not found" });
    }

  
    if (
      leave.user.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const { startDate, endDate, type, reason } = req.body;

    if (startDate !== undefined) leave.startDate = startDate;
    if (endDate !== undefined) leave.endDate = endDate;
    if (type !== undefined) leave.type = type;
    if (reason !== undefined) leave.reason = reason;

    const updated = await leave.save();
    res.json(updated);
  } catch (err) {
    console.error("PATCH /leaves/:id error:", err);
    res.status(400).json({ message: err.message });
  }
});



router.delete("/mine", auth, async (req, res) => {
  try {
    console.log("HIT /api/leaves/mine for user", req.user.id);
    const result = await LeaveRequest.deleteMany({ user: req.user.id });
    console.log("deleteMany result:", result);
    res.json({
      message: `Deleted ${result.deletedCount} leave request(s)`,
    });
  } catch (err) {
    console.error("DELETE /leaves/mine error:", err);
    res.status(500).json({ message: err.message });
  }
});


router.delete("/:id", auth, async (req, res) => {
  try {
    console.log("HIT /api/leaves/:id with", req.params.id);
    const leave = await LeaveRequest.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({ message: "Leave not found" });
    }

    if (
      leave.user.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await leave.deleteOne();
    res.json({ message: "Leave deleted" });
  } catch (err) {
    console.error("DELETE /leaves/:id error:", err);
    res.status(400).json({ message: err.message });
  }
});


export default router;
