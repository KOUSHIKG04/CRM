const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const Lead = require("../models/Lead");
const { auth, checkRole } = require("../middleware/auth");

// @route   GET api/leads
// @desc    Get all leads
// @access  Private (Telecaller & Admin)
router.get("/", auth, checkRole(["admin", "telecaller"]), async (req, res) => {
  try {
    const leads = await Lead.find()
      .sort({ createdAt: -1 })
      .populate("assignedTo", "name email");
    res.json(leads);
  } catch (err) {
    console.error("Error fetching leads:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST api/leads
// @desc    Create a new lead
// @access  Private (Telecaller & Admin)
router.post(
  "/",
  [
    auth,
    checkRole(["admin", "telecaller"]),
    // Validation
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("phone").notEmpty().withMessage("Phone number is required"),
    body("address").notEmpty().withMessage("Address is required"),
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, phone, address } = req.body;

      const lead = new Lead({
        name,
        email,
        phone,
        address,
        status: "pending",
        assignedTo: req.user.userId,
      });

      await lead.save();

      // Populate the assignedTo field before sending response
      await lead.populate("assignedTo", "name email");
      res.status(201).json(lead);
    } catch (err) {
      console.error("Error creating lead:", err);
      res.status(500).json({ message: err.message || "Server error" });
    }
  }
);

// @route   PATCH api/leads/:id
// @desc    Update a lead
// @access  Private (Telecaller & Admin)
router.patch(
  "/:id",
  auth,
  checkRole(["admin", "telecaller"]),
  async (req, res) => {
    try {
      const lead = await Lead.findById(req.params.id);

      if (!lead) {
        return res.status(404).json({ message: "Lead not found" });
      }

      // Only assigned telecaller or admin can update
      if (
        req.user.role !== "admin" &&
        lead.assignedTo.toString() !== req.user.userId
      ) {
        return res
          .status(403)
          .json({ message: "Not authorized to update this lead" });
      }

      const updatedLead = await Lead.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      ).populate("assignedTo", "name email");

      res.json(updatedLead);
    } catch (err) {
      console.error("Error updating lead:", err);
      res.status(500).json({ message: err.message || "Server error" });
    }
  }
);

// @route   DELETE api/leads/:id
// @desc    Delete a lead
// @access  Private (Admin only)
router.delete("/:id", auth, checkRole(["admin"]), async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    await lead.deleteOne();
    res.json({ message: "Lead removed" });
  } catch (err) {
    console.error("Error deleting lead:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
});

// @route   PATCH api/leads/:id/status
// @desc    Update lead status
// @access  Private (Telecaller & Admin)
router.patch(
  "/:id/status",
  [
    auth,
    checkRole(["admin", "telecaller"]),
    body("status")
      .isIn([
        "pending",
        "contacted",
        "interested",
        "not-interested",
        "callback",
      ])
      .withMessage("Invalid status value"),
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { status } = req.body;
      const lead = await Lead.findById(req.params.id);

      if (!lead) {
        return res.status(404).json({ message: "Lead not found" });
      }

      // Only assigned telecaller or admin can update status
      if (
        req.user.role !== "admin" &&
        lead.assignedTo.toString() !== req.user.userId
      ) {
        return res
          .status(403)
          .json({ message: "Not authorized to update this lead" });
      }

      lead.status = status;
      lead.lastCallDate = new Date();
      await lead.save();
      await lead.populate("assignedTo", "name email");

      res.json(lead);
    } catch (err) {
      console.error("Error updating lead status:", err);
      res.status(500).json({ message: err.message || "Server error" });
    }
  }
);

// @route   GET api/leads/connected
// @desc    Get all connected leads
// @access  Private (Admin only)
router.get("/connected", auth, checkRole(["admin"]), async (req, res) => {
  try {
    const connectedLeads = await Lead.find({ status: "contacted" })
      .sort({ lastCallDate: -1 })
      .populate("assignedTo", "name email")
      .limit(10);
    res.json(connectedLeads);
  } catch (err) {
    console.error("Error fetching connected leads:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
});

module.exports = router;
