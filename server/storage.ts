import { campaigns, users, type User, type InsertUser, type Campaign, type InsertCampaign } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Campaign methods
  getCampaigns(): Promise<Campaign[]>;
  getCampaign(id: number): Promise<Campaign | undefined>;
  createCampaign(campaign: InsertCampaign): Promise<Campaign>;
  updateCampaign(id: number, campaign: Partial<InsertCampaign>): Promise<Campaign | undefined>;
  deleteCampaign(id: number): Promise<boolean>;
  toggleCampaignStatus(id: number): Promise<Campaign | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private campaigns: Map<number, Campaign>;
  private userCurrentId: number;
  private campaignCurrentId: number;

  constructor() {
    this.users = new Map();
    this.campaigns = new Map();
    this.userCurrentId = 1;
    this.campaignCurrentId = 1;
    
    // Add some default campaigns for demo
    const defaultCampaigns: InsertCampaign[] = [
      {
        name: "Construction Campaign",
        script: "Hello, this is a voice assistant calling about your construction project.",
        objective: "You are an AI sales representative calling on behalf of Aparna Sarovar, a premium luxury apartment project in Nallagandla. Your goal is to engage the customer, gauge their interest, and persuade them to visit the site. The primary focus is on securing a visit rather than providing extensive details over the call.",
        guidelines: "• Greet the customer by name and introduce yourself as Amit, a representative from Aparna Sarovar.\n• Maintain a friendly and professional tone.\n• Keep responses concise and avoid speaking more than two sentences at a time.\n• Always end with a question or prompt to encourage customer response.\n• If the customer is interested, guide them toward booking a site visit.\n• If they hesitate, address their concerns but steer the conversation back to the visit.\n• Adapt responses based on the customer's interest and objections.\n• Avoid overloading the customer with information—focus on securing a visit.\n• Log key details (interest level, preferred visit time, objections, etc.) into the CRM.\n• Ensure data privacy and compliance with DND regulations.\n• Follow predefined scripts while allowing for dynamic, context-based interactions.",
        callFlow: "Call Flow & Sample Prompts:\n1. Introduction:\n• \"Hello, am I speaking with [Customer Name]?\"",
        voiceType: "Indian Male Voice",
        maxCallCount: 1000,
        status: true,
        createdBy: 1
      },
      {
        name: "Urban Nest Site Visit Drive",
        script: "Hello, this is a voice assistant to schedule your site visit.",
        objective: "You are an AI representative for Urban Nest properties trying to schedule site visits with potential buyers.",
        guidelines: "• Be professional but conversational\n• Focus on the key benefits of the property\n• Address questions about location and amenities",
        callFlow: "1. Introduction\n2. Describe property highlights\n3. Suggest available visit times",
        voiceType: "Default Voice (Female)",
        maxCallCount: 1,
        status: false,
        createdBy: 1
      },
      {
        name: "The Pinnacle Residency Tour",
        script: "Hello, this is a voice assistant to confirm your residency tour.",
        objective: "You're confirming scheduled tours for The Pinnacle luxury residences.",
        guidelines: "• Thank customers for their interest\n• Confirm date and time\n• Ask if they need directions",
        callFlow: "1. Greeting\n2. Confirmation\n3. Address any questions",
        voiceType: "Default Voice (Male)",
        maxCallCount: 500,
        status: true,
        createdBy: 1
      },
      {
        name: "Opulent Heights Site Tour",
        script: "Hello, this is a voice assistant to schedule your site tour.",
        objective: "Schedule tours for the new Opulent Heights development.",
        guidelines: "• Emphasize luxury amenities\n• Mention limited availability\n• Offer weekend and weekday slots",
        callFlow: "1. Introduction\n2. Highlight features\n3. Schedule appointment",
        voiceType: "Default Voice (Female)",
        maxCallCount: 200,
        status: false,
        createdBy: 1
      },
      {
        name: "Test Campaign",
        script: "This is a test campaign script.",
        objective: "This is a test campaign for internal testing purposes.",
        guidelines: "• Keep it brief\n• Test all system features",
        callFlow: "1. Test greeting\n2. Test response\n3. End call",
        voiceType: "Default Voice (Male)",
        maxCallCount: 1,
        status: false,
        createdBy: 1
      }
    ];
    
    // Create default user
    this.createUser({
      username: "Shiva Chintaluru",
      password: "password123"
    });
    
    // Create default campaigns
    defaultCampaigns.forEach(campaign => this.createCampaign(campaign));
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const now = new Date();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async getCampaigns(): Promise<Campaign[]> {
    return Array.from(this.campaigns.values());
  }
  
  async getCampaign(id: number): Promise<Campaign | undefined> {
    return this.campaigns.get(id);
  }
  
  async createCampaign(insertCampaign: InsertCampaign): Promise<Campaign> {
    const id = this.campaignCurrentId++;
    const now = new Date();
    const campaign: Campaign = { 
      id,
      name: insertCampaign.name,
      script: insertCampaign.script, 
      voiceType: insertCampaign.voiceType,
      maxCallCount: insertCampaign.maxCallCount,
      status: insertCampaign.status || false,
      createdBy: insertCampaign.createdBy || null,
      publishedAt: now,
      objective: insertCampaign.objective || null,
      guidelines: insertCampaign.guidelines || null,
      callFlow: insertCampaign.callFlow || null
    };
    this.campaigns.set(id, campaign);
    return campaign;
  }
  
  async updateCampaign(id: number, updatedCampaign: Partial<InsertCampaign>): Promise<Campaign | undefined> {
    const campaign = this.campaigns.get(id);
    if (!campaign) return undefined;
    
    const updatedRecord: Campaign = {
      ...campaign,
      name: updatedCampaign.name !== undefined ? updatedCampaign.name : campaign.name,
      script: updatedCampaign.script !== undefined ? updatedCampaign.script : campaign.script,
      voiceType: updatedCampaign.voiceType !== undefined ? updatedCampaign.voiceType : campaign.voiceType,
      maxCallCount: updatedCampaign.maxCallCount !== undefined ? updatedCampaign.maxCallCount : campaign.maxCallCount,
      status: updatedCampaign.status !== undefined ? updatedCampaign.status : campaign.status,
      createdBy: updatedCampaign.createdBy !== undefined ? updatedCampaign.createdBy : campaign.createdBy,
      objective: updatedCampaign.objective !== undefined ? updatedCampaign.objective : campaign.objective,
      guidelines: updatedCampaign.guidelines !== undefined ? updatedCampaign.guidelines : campaign.guidelines,
      callFlow: updatedCampaign.callFlow !== undefined ? updatedCampaign.callFlow : campaign.callFlow
    };
    
    this.campaigns.set(id, updatedRecord);
    return updatedRecord;
  }
  
  async deleteCampaign(id: number): Promise<boolean> {
    return this.campaigns.delete(id);
  }
  
  async toggleCampaignStatus(id: number): Promise<Campaign | undefined> {
    const campaign = this.campaigns.get(id);
    if (!campaign) return undefined;
    
    const newStatus = !(campaign.status === true);
    
    const updatedCampaign: Campaign = {
      id: campaign.id,
      name: campaign.name,
      script: campaign.script, 
      voiceType: campaign.voiceType,
      maxCallCount: campaign.maxCallCount,
      status: newStatus,
      createdBy: campaign.createdBy,
      publishedAt: campaign.publishedAt,
      objective: campaign.objective,
      guidelines: campaign.guidelines,
      callFlow: campaign.callFlow
    };
    
    this.campaigns.set(id, updatedCampaign);
    return updatedCampaign;
  }
}

export const storage = new MemStorage();
