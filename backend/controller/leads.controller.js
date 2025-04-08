const User = require("../models/User");
const Lead = require("../models/Lead");
const { validationResult } = require("express-validator");

const getLeads = async (req, res) => {
  try {
    let query = {};
    // If user is a telecaller, only show their leads
    if (req.user.role === "telecaller") {
      query.assignedTo = req.user.userId;
    }

    const leads = await Lead.find(query)
      .sort({ createdAt: -1 })
      .populate("assignedTo", "name email");
    res.json(leads);
  } catch (err) {
    console.error("Error fetching leads:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const createLead = async (req, res) => {
  try {
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
      assignedTo: req.user.userId, // Assign to current user
    });

    await lead.save();

    // Populate the assignedTo field before sending response
    await lead.populate("assignedTo", "name email");
    res.status(201).json(lead);
  } catch (err) {
    console.error("Error creating lead:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

const updateLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    // Check if user is telecaller and the lead is assigned to them
    if (
      req.user.role === "telecaller" &&
      lead.assignedTo.toString() !== req.user.userId
    ) {
      return res.status(403).json({
        message: "Access denied: You can only edit leads assigned to you",
      });
    }

    const updatedLead = await Lead.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).populate("assignedTo", "name email");

    res.json(updatedLead);
  } catch (err) {
    console.error("Error updating lead:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    // Check if user is telecaller and the lead is assigned to them
    if (
      req.user.role === "telecaller" &&
      lead.assignedTo.toString() !== req.user.userId
    ) {
      return res.status(403).json({
        message: "Access denied: You can only delete leads assigned to you",
      });
    }

    await Lead.findByIdAndDelete(req.params.id);
    res.json({ message: "Lead deleted successfully" });
  } catch (err) {
    console.error("Error deleting lead:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const updateLeadStatus = async (req, res) => {
  try {
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
      req.user.role === "telecaller" &&
      lead.assignedTo.toString() !== req.user.userId.toString()
    ) {
      return res.status(403).json({
        message: "Not authorized to update this lead",
        details: {
          userId: req.user.userId,
          assignedTo: lead.assignedTo,
        },
      });
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
};

const getConnectedLeads = async (req, res) => {
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
};

const updateCallResponse = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    // Check if user is telecaller and the lead is assigned to them
    if (
      req.user.role === "telecaller" &&
      lead.assignedTo.toString() !== req.user.userId
    ) {
      return res.status(403).json({
        message:
          "Access denied: You can only update calls for leads assigned to you",
      });
    }

    const { callResponse, callNotes, nextCallDate, isConnected } = req.body;

    const updatedLead = await Lead.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          callResponse,
          callNotes,
          nextCallDate,
          lastCallDate: new Date(),
          isConnected,
          status: isConnected ? "contacted" : "pending",
        },
      },
      { new: true }
    ).populate("assignedTo", "name email");

    res.json(updatedLead);
  } catch (err) {
    console.error("Error updating call response:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getLeadStatus = async (req, res) => {
  try {
    // Basic counts
    const [totalLeads, totalTelecallers, totalCalls] = await Promise.all([
      Lead.countDocuments(),
      User.countDocuments({ role: "telecaller" }),
      Lead.countDocuments({ lastCallDate: { $ne: null } }),
    ]);

    // Status counts
    const [totalContacted, statusCounts] = await Promise.all([
      Lead.countDocuments({
        status: { $in: ["contacted", "interested"] },
      }),
      Lead.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    // Call response counts
    const callResponseCounts = await Lead.aggregate([
      {
        $match: {
          callResponse: { $ne: null },
        },
      },
      {
        $group: {
          _id: "$callResponse",
          count: { $sum: 1 },
        },
      },
    ]);

    // Call trends for last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const callTrends = await Lead.aggregate([
      {
        $match: {
          lastCallDate: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$lastCallDate" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Recent activity
    const recentActivity = await Lead.find({
      lastCallDate: { $ne: null },
    })
      .sort({ lastCallDate: -1 })
      .limit(10)
      .populate("assignedTo", "name email");

    // Return all statistics in a single response
    res.json({
      // Basic metrics
      totalLeads,
      totalTelecallers,
      totalCalls,
      totalContacted,

      // Detailed metrics
      statusCounts,
      callResponseCounts,
      callTrends,
      recentActivity,

      // Additional metrics that might be useful
      connectedCalls: await Lead.countDocuments({ status: "connected" }),
      pendingCalls: await Lead.countDocuments({ status: "pending" }),
      callbackCalls: await Lead.countDocuments({ status: "callback" }),
    });
  } catch (err) {
    console.error("Error fetching lead statistics:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getLeads,
  createLead,
  updateLead,
  deleteLead,
  getConnectedLeads,
  updateLeadStatus,
  updateCallResponse,
  getLeadStatus,
};
