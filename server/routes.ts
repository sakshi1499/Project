import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "./index";
import { users } from "@shared/schema";
import { insertCampaignSchema, insertCallHistorySchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all campaigns
  app.get("/api/campaigns", async (_req, res) => {
    try {
      const campaigns = await storage.getCampaigns();
      res.json(campaigns);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch campaigns" });
    }
  });

  // Get a specific campaign
  app.get("/api/campaigns/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid campaign ID" });
      }

      const campaign = await storage.getCampaign(id);
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }

      res.json(campaign);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch campaign" });
    }
  });

  // Create a new campaign
  app.post("/api/campaigns", async (req, res) => {
    try {
      const validatedData = insertCampaignSchema.parse(req.body);
      const campaign = await storage.createCampaign(validatedData);
      res.status(201).json(campaign);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid campaign data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create campaign" });
    }
  });

  // Update a campaign
  app.patch("/api/campaigns/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid campaign ID" });
      }

      // Allow partial updates with subset of insertCampaignSchema
      const validatedData = insertCampaignSchema.partial().parse(req.body);
      
      const updatedCampaign = await storage.updateCampaign(id, validatedData);
      if (!updatedCampaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }

      res.json(updatedCampaign);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid campaign data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update campaign" });
    }
  });

  // Delete a campaign
  app.delete("/api/campaigns/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid campaign ID" });
      }

      const success = await storage.deleteCampaign(id);
      if (!success) {
        return res.status(404).json({ message: "Campaign not found" });
      }

      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete campaign" });
    }
  });

  // Toggle campaign status
  app.post("/api/campaigns/:id/toggle", async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid campaign ID" });
      }

      const updatedCampaign = await storage.toggleCampaignStatus(id);
      if (!updatedCampaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }

      res.json(updatedCampaign);
    } catch (error) {
      res.status(500).json({ message: "Failed to toggle campaign status" });
    }
  });
  
  // Duplicate campaign
  app.post("/api/campaigns/:id/duplicate", async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid campaign ID" });
      }

      const campaign = await storage.getCampaign(id);
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }

      // Create a new campaign with same data but a new name
      const newCampaign = await storage.createCampaign({
        name: `${campaign.name} (Copy)`,
        script: campaign.script,
        voiceType: campaign.voiceType,
        maxCallCount: campaign.maxCallCount,
        status: false,
        createdBy: campaign.createdBy || 1,
        objective: campaign.objective || "",
        guidelines: campaign.guidelines || "",
        callFlow: campaign.callFlow || "",
      });

      res.status(201).json(newCampaign);
    } catch (error) {
      res.status(500).json({ message: "Failed to duplicate campaign" });
    }
  });

  // Call History Routes
  
  // Get all call history records
  app.get("/api/call-history", async (_req, res) => {
    try {
      const callHistory = await storage.getCallHistory();
      res.json(callHistory);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch call history" });
    }
  });

  // Get call history by campaign ID
  app.get("/api/call-history/campaign/:id", async (req, res) => {
    try {
      const campaignId = parseInt(req.params.id, 10);
      if (isNaN(campaignId)) {
        return res.status(400).json({ message: "Invalid campaign ID" });
      }

      const callHistory = await storage.getCallHistoryByCampaign(campaignId);
      res.json(callHistory);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch call history" });
    }
  });

  // Get a specific call history item
  app.get("/api/call-history/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid call history ID" });
      }

      const callHistoryItem = await storage.getCallHistoryItem(id);
      if (!callHistoryItem) {
        return res.status(404).json({ message: "Call history item not found" });
      }

      res.json(callHistoryItem);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch call history item" });
    }
  });

  // Create a new call history record
  app.post("/api/call-history", async (req, res) => {
    try {
      const validatedData = insertCallHistorySchema.parse(req.body);
      const callHistoryItem = await storage.createCallHistoryItem(validatedData);
      res.status(201).json(callHistoryItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid call history data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create call history record" });
    }
  });

  // Update call history status
  app.patch("/api/call-history/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid call history ID" });
      }

      const { status } = req.body;
      if (!status || typeof status !== "string") {
        return res.status(400).json({ message: "Status is required" });
      }

      const updatedCallHistory = await storage.updateCallHistoryStatus(id, status);
      if (!updatedCallHistory) {
        return res.status(404).json({ message: "Call history item not found" });
      }

      res.json(updatedCallHistory);
    } catch (error) {
      res.status(500).json({ message: "Failed to update call history status" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
