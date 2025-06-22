const { inilizeData } = require("./db/db.connect");
inilizeData();

const express = require("express");
const cors = require("cors");
const Lead = require("./models/leads.model");
const SalesAgent = require("./models/salesAgent.model");
const Comment = require("./models/comment.model");

const app = express();
app.use(express.json());

require("dotenv").config();

const corsOption = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: true,
};
app.use(cors(corsOption));

// Create a New Lead

async function addLeads(leads) {
  try {
    const saveingLeads = Lead(leads);
    const savedLeads = await saveingLeads.save();

    return savedLeads;
  } catch (error) {
    console.log("save Leads error", error);
  }
}

app.post("/leads", async (req, res) => {
  try {
    const leads = await addLeads(req.body);
    if (leads) {
      res.status(201).json({ message: "Leads is saved" });
    }
  } catch (error) {
    console.log("Error:", error);
  }
});

//   all Leads category

async function showAllLeads(filter) {
  try {
    const allLeads = await Lead.find(filter).populate("salesAgent");
    return allLeads;
  } catch (error) {
    console.log("Error:", error);
  }
}

app.get("/leads", async (req, res) => {
  try {
    const { salesAgent, status, tags, source } = req.query;
    const filter = {};

    if (salesAgent) {
      filter.salesAgent = salesAgent;
    }

    if (status) {
      filter.status = status;
    }

    if (tags) {
      filter.tags = tags;
    }

    if (source) {
      filter.source = source;
    }
    const leads = await showAllLeads(filter);
    if (leads) {
      res.status(200).json(leads);
    } else {
      res
        .status(400)
        .json({ error: `Invalid input:  must be one of ${filter}.` });
    }
  } catch (error) {
    console.log("Error:", error);
  }
});

// Update leads

async function updateLeads(leadsId, updateToLeads) {
  try {
    const updatingLeads = await Lead.findByIdAndUpdate(leadsId, updateToLeads, {
      new: true,
    });
    return updatingLeads;
  } catch (error) {
    console.log("Error:", error);
  }
}

app.post("/v1/leads/:id", async (req, res) => {
  try {
    const updatedLeads = await updateLeads(req.params.id, req.body);
    if (updatedLeads) {
      res.status(201).json(updatedLeads);
    } else {
      res.status(404).json({ error: "failed to update leads" });
    }
  } catch (error) {
    console.log("Error:", error);
  }
});

// Delete Leads

async function deleteLeads(leadsId) {
  try {
    const deleteingLeads = await Lead.findByIdAndDelete(leadsId);
    return deleteingLeads;
  } catch (error) {
    console.log("Error:", error);
  }
}

app.delete("/v2/leads/:id", async (req, res) => {
  try {
    const deletedLeads = await deleteLeads(req.params.id);
    if (deletedLeads) {
      res.status(200).json({ message: "Lead deleted successfully." });
    } else {
      res
        .status(404)
        .json({ error: `Lead with ID ${req.params.id} not found.` });
    }
  } catch (error) {
    console.log("Error:", error);
  }
});

// create salesAgent
async function addsalesAgent(agents) {
  try {
    const addingAgent = SalesAgent(agents);
    const addedAgents = await addingAgent.save();

    return addedAgents;
  } catch (error) {
    console.log("Error:", error);
  }
}

app.post("/v1/agents", async (req, res) => {
  try {
    const saveAgents = await addsalesAgent(req.body);
    if (saveAgents) {
      res.status(201).json({ message: "Agent added successfully." });
    } else {
      res.status(404).json({ error: "failed to add Agent." });
    }
  } catch (error) {
    console.log("Error:", error);
  }
});

// Get all SalesAgents

async function showAllSalesAgent() {
  try {
    const gettingSalesAgents = await SalesAgent.find();
    return gettingSalesAgents;
  } catch (error) {
    console.log("Error:", error);
  }
}

app.get("/v2/agents", async (req, res) => {
  try {
    const gotSalesAgents = await showAllSalesAgent();
    if (gotSalesAgents) {
      res.status(200).json(gotSalesAgents);
    } else {
      res.status(404).json({ error: "Failed to get SalesAgents." });
    }
  } catch (error) {
    console.log("Error:", error);
  }
});

// add a comment to a lead
async function addCommentLead(leadId, comments) {
  try {
    const lead = await Lead.findById(leadId);
    const comment = new Comment({ ...comments, lead: lead._id });
    const savedComment = await comment.save();
    return savedComment;
  } catch (error) {
    console.log("Error:", error);
  }
}

app.post("/leads/:id/comments", async (req, res) => {
  try {
    const gotComments = await addCommentLead(req.params.id, req.body);
    if (gotComments) {
      res.status(201).json({ message: "comment created successfully." });
    } else {
      res
        .status(404)
        .json({ error: `Lead with ID ${req.params.id} not found.` });
    }
  } catch (error) {
    console.log("Error:", error);
  }
});

// Get all Comments

async function showAllComments(commentId) {
  try {
    const gettingComments = await Comment.find({ lead: commentId })
      .populate("lead")
      .populate("author");

    return gettingComments;
  } catch (error) {
    console.log("Error:", error);
  }
}

app.get("/leads/:id/comments", async (req, res) => {
  try {
    const allComments = await showAllComments(req.params.id);

    if (allComments) {
      res.status(200).json(allComments);
    } else {
      res.status(404).json({ error: "Failed to get Comments." });
    }
  } catch (error) {
    console.log("Error:", error);
  }
});

// Reporting APi

async function reportingApi() {
  try {
    const weekago = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const leads = await Lead.find({
      status: "Closed",
      updatedAt: { $gte: weekago },
    }).populate("salesAgent");

    const result = leads.map((lead) => ({
      id: lead._id,
      name: lead.name,
      salesAgent: lead.salesAgent?.name,
      closeAt: lead.updatedAt,
    }));

    return result;
  } catch (error) {
    console.log("Error:", error);
  }
}

app.get("/report/last-week", async (req, res) => {
  try {
    const lastweek = await reportingApi();
    res.status(200).json(lastweek);
  } catch (error) {
    console.log("Error:", error);
  }
});

async function totalLeadsInPipeline() {
  try {
    const count = await Lead.countDocuments({ status: "Closed" });

    return count;
  } catch (error) {
    console.log("Error:", error);
  }
}

app.get("/report/pipeline", async (req, res) => {
  try {
    const totalLeads = await totalLeadsInPipeline();
    res.status(200).json({ totalLeadsInPipeline: totalLeads });
  } catch (error) {
    console.log("Error:", error);
  }
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log("Server is running on PORT:", PORT);
});
