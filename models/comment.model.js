const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    lead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      require: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "salesAgent",
      require: true,
    },
    commentText: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);
