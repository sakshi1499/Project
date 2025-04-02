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
        voiceType: "Default Voice (Male)",
        maxCallCount: 1000,
        status: true,
        createdBy: 1
      },
      {
        name: "Urban Nest Site Visit Drive",
        script: "Hello, this is a voice assistant to schedule your site visit.",
        voiceType: "Default Voice (Female)",
        maxCallCount: 1,
        status: false,
        createdBy: 1
      },
      {
        name: "The Pinnacle Residency Tour",
        script: "Hello, this is a voice assistant to confirm your residency tour.",
        voiceType: "Default Voice (Male)",
        maxCallCount: 500,
        status: true,
        createdBy: 1
      },
      {
        name: "Opulent Heights Site Tour",
        script: "Hello, this is a voice assistant to schedule your site tour.",
        voiceType: "Default Voice (Female)",
        maxCallCount: 200,
        status: false,
        createdBy: 1
      },
      {
        name: "Test Campaign",
        script: "This is a test campaign script.",
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
      ...insertCampaign, 
      id, 
      publishedAt: now
    };
    this.campaigns.set(id, campaign);
    return campaign;
  }
  
  async updateCampaign(id: number, updatedCampaign: Partial<InsertCampaign>): Promise<Campaign | undefined> {
    const campaign = this.campaigns.get(id);
    if (!campaign) return undefined;
    
    const updatedRecord: Campaign = {
      ...campaign,
      ...updatedCampaign
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
    
    const updatedCampaign: Campaign = {
      ...campaign,
      status: !campaign.status
    };
    
    this.campaigns.set(id, updatedCampaign);
    return updatedCampaign;
  }
}

export const storage = new MemStorage();
