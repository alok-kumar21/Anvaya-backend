const mongoose = require("mongoose");

// Lead Schema
const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  source: {
    type: String,
    require: true,
    enum: [
      "Website",
      "Referral",
      "Cold Call",
      "Advertisement",
      "Email",
      "Other",
    ], // Predefined lead sources
  },
  salesAgent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SalesAgent", // Reference to SalesAgent model
    require: true,
  },
  status: {
    type: String,
    require: true,
    enum: ["New", "Contacted", "Qualified", "Proposal Sent", "Closed"], // Predefined lead statuses
    default: "New",
  },
  tags: {
    type: [String], // Array of strings for tags (e.g., High Value, Follow-up)
  },
  timeToClose: {
    type: Number,
    require: true,
    min: [1, "Time to Close must be a positive number"], // Positive integer validation
  },
  priority: {
    type: String,
    require: true,
    enum: ["High", "Medium", "Low"], // Predefined priority levels
    default: "Medium",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  closedAt: {
    type: Date, 
  },
});

// Middleware to update the `updatedAt` field on each save
leadSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Lead", leadSchema);
