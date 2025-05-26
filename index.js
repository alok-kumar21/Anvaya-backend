const express = require("express");
const { inilizeData } = require("./db/db.connect");

const Lead = require("./models/leads.model");
const SalesAgent = require("./models/salesAgent.model");

const app = express();

inilizeData();
require("dotenv").config();

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

//  get all Leads

async function showAllLeads() {
  try {
    const allLeads = await Lead.find().populate("salesAgent");
    return allLeads;
  } catch (error) {
    console.log("Error:", error);
  }
}

app.get("/leads", async (req, res) => {
  try {
    const showLeads = await showAllLeads();

    if (showAllLeads) {
      res.json(showLeads);
    } else {
      res.status(404).json({ error: "leads not found." });
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

app.post("/agents", async (req, res) => {
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

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log("Server is running on PORT:", PORT);
});
