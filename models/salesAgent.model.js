const mongoose = require("mongoose");

// Sales Agent Schema
const salesAgentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SalesAgent", salesAgentSchema);
