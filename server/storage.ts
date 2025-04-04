import { 
  campaigns, 
  users, 
  callHistory, 
  type User, 
  type InsertUser, 
  type Campaign, 
  type InsertCampaign, 
  type CallHistory, 
  type InsertCallHistory 
} from "@shared/schema";

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

  // Call History methods
  getCallHistory(): Promise<CallHistory[]>;
  getCallHistoryByCampaign(campaignId: number): Promise<CallHistory[]>;
  getCallHistoryByContact(contactEmail: string): Promise<CallHistory[]>;
  getCallHistoryItem(id: number): Promise<CallHistory | undefined>;
  createCallHistoryItem(callHistory: InsertCallHistory): Promise<CallHistory>;
  updateCallHistoryStatus(id: number, status: string): Promise<CallHistory | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private campaigns: Map<number, Campaign>;
  private callHistories: Map<number, CallHistory>;
  private userCurrentId: number;
  private campaignCurrentId: number;
  private callHistoryCurrentId: number;

  constructor() {
    this.users = new Map();
    this.campaigns = new Map();
    this.callHistories = new Map();
    this.userCurrentId = 1;
    this.campaignCurrentId = 1;
    this.callHistoryCurrentId = 1;

    // Add some default campaigns for demo
    const defaultCampaigns: InsertCampaign[] = [
      {
        name: "Construction Campaign",
        script: "Hello, I'm calling about a luxury construction project.",
        objective: "Schedule site visits for new construction project.",
        guidelines: "• Greet professionally\n• Focus on project highlights\n• Schedule site visits",
        callFlow: "1. Introduction\n2. Project overview\n3. Schedule visit",
        voiceType: "Indian Male Voice",
        maxCallCount: 1000,
        status: true,
        createdBy: 1
      },
      {
        name: "Premium Apartment Sales",
        script: "Hi, I'm calling about our premium apartment complex.",
        objective: "Generate leads for luxury apartments.",
        guidelines: "• Highlight amenities\n• Discuss location benefits\n• Offer virtual tours",
        callFlow: "1. Greeting\n2. Features overview\n3. Tour booking",
        voiceType: "Indian Female Voice",
        maxCallCount: 800,
        status: true,
        createdBy: 1
      },
      {
        name: "Villa Project Launch",
        script: "Hello, I'm reaching out about our new villa project launch.",
        objective: "Pre-launch bookings for villa project.",
        guidelines: "• Emphasize exclusivity\n• Discuss early-bird offers\n• Set up meetings",
        callFlow: "1. Introduction\n2. Project brief\n3. Booking process",
        voiceType: "British Male Voice",
        maxCallCount: 500,
        status: false,
        createdBy: 1
      },
      {
        name: "Investment Property",
        script: "Hi, calling about an investment opportunity in real estate.",
        objective: "Target potential investors for property.",
        guidelines: "• Focus on ROI\n• Explain payment plans\n• Schedule consultations",
        callFlow: "1. Greeting\n2. Investment details\n3. Meeting setup",
        voiceType: "American Male Voice",
        maxCallCount: 600,
        status: true,
        createdBy: 1
      },
      {
        name: "Waterfront Residences",
        script: "Hello, I'm calling about our waterfront property project.",
        objective: "Promote waterfront luxury homes.",
        guidelines: "• Highlight waterfront features\n• Discuss unique amenities\n• Book site visits",
        callFlow: "1. Introduction\n2. Location benefits\n3. Visit scheduling",
        voiceType: "Indian Male Voice",
        maxCallCount: 700,
        status: true,
        createdBy: 1
      },
      {
        name: "Smart Home Project",
        script: "Hi, I'm calling about our smart home development.",
        objective: "Promote tech-enabled luxury homes.",
        guidelines: "• Explain smart features\n• Discuss automation\n• Demo scheduling",
        callFlow: "1. Greeting\n2. Tech overview\n3. Demo booking",
        voiceType: "American Female Voice",
        maxCallCount: 400,
        status: false,
        createdBy: 1
      },
      {
        name: "Golf View Apartments",
        script: "Hello, calling about our golf-view luxury apartments.",
        objective: "Sell golf course facing properties.",
        guidelines: "• Emphasize golf amenities\n• Discuss lifestyle\n• Arrange viewings",
        callFlow: "1. Introduction\n2. Golf benefits\n3. Visit booking",
        voiceType: "British Female Voice",
        maxCallCount: 300,
        status: true,
        createdBy: 1
      },
      {
        name: "Eco-Friendly Homes",
        script: "Hi, I'm calling about our sustainable living project.",
        objective: "Promote eco-friendly residential project.",
        guidelines: "• Highlight sustainability\n• Discuss green features\n• Schedule tours",
        callFlow: "1. Greeting\n2. Green features\n3. Tour booking",
        voiceType: "Indian Female Voice",
        maxCallCount: 450,
        status: true,
        createdBy: 1
      },
      {
        name: "Senior Living Complex",
        script: "Hello, I'm calling about our senior living community.",
        objective: "Promote senior-friendly homes.",
        guidelines: "• Focus on accessibility\n• Discuss medical facilities\n• Arrange visits",
        callFlow: "1. Introduction\n2. Facility overview\n3. Visit scheduling",
        voiceType: "British Male Voice",
        maxCallCount: 250,
        status: false,
        createdBy: 1
      },
    ];

    // Create default user
    this.createUser({
      username: "Shiva Chintaluru",
      password: "password123"
    });

    // Create default campaigns
    defaultCampaigns.forEach(campaign => this.createCampaign(campaign));

    // Create sample call history records
    const sampleCallRecords = [
      {
        campaignId: 1,
        contactName: "Amit Khanna",
        contactEmail: "amit.khanna@gmail.com",
        contactPhone: "+91 98765 43210",
        status: "Lead Interested",
        callSummary: "The call successfully concluded with Arianna expressing her need for loan and asking for more details on it. The details have been sent over the email.",
        recordingUrl: "/recordings/call-1.mp3",
        transcriptUrl: "/transcripts/call-1.txt"
      },
      {
        campaignId: 1,
        contactName: "Priya Mehta",
        contactEmail: "priya.mehta@yahoo.com",
        contactPhone: "+91 99887 76543",
        status: "Not Interested",
        callSummary: "Customer stated they are not interested in the property at this time.",
        recordingUrl: "/recordings/call-2.mp3",
        transcriptUrl: "/transcripts/call-2.txt"
      },
      {
        campaignId: 1,
        contactName: "Rohit Sharma",
        contactEmail: "rohit.sharma@hotmail.com",
        contactPhone: "+91 97654 32109",
        status: "Lead Interested",
        callSummary: "Rohit showed strong interest in the premium apartment features and requested a site visit.",
        recordingUrl: "/recordings/call-3.mp3",
        transcriptUrl: "/transcripts/call-3.txt"
      },
      {
        campaignId: 1,
        contactName: "Sneha Iyer",
        contactEmail: "sneha.iyer@gmail.com",
        contactPhone: "+91 98760 98765",
        status: "Not Interested",
        callSummary: "Currently looking for properties in a different location.",
        recordingUrl: "/recordings/call-4.mp3",
        transcriptUrl: "/transcripts/call-4.txt"
      },
      {
        campaignId: 1,
        contactName: "Vikas Nair",
        contactEmail: "vikas.nair@hotmail.com",
        contactPhone: "+91 98989 12345",
        status: "Need to follow up",
        callSummary: "Interested but needs time to discuss with family. Follow up in a week.",
        recordingUrl: "/recordings/call-5.mp3",
        transcriptUrl: "/transcripts/call-5.txt"
      },
      {
        campaignId: 1,
        contactName: "Anjali Verma",
        contactEmail: "anjali.verma@gmail.com",
        contactPhone: "+91 99007 65432",
        status: "Not Interested",
        callSummary: "Already purchased a property recently.",
        recordingUrl: "/recordings/call-6.mp3",
        transcriptUrl: "/transcripts/call-6.txt"
      },
      {
        campaignId: 1,
        contactName: "Karan Malhotra",
        contactEmail: "karan.malhotra@gmail.com",
        contactPhone: "+91 98123 87654",
        status: "Not Interested",
        callSummary: "Budget constraints, looking for something more affordable.",
        recordingUrl: "/recordings/call-7.mp3",
        transcriptUrl: "/transcripts/call-7.txt"
      },
      {
        campaignId: 1,
        contactName: "Riya Kapoor",
        contactEmail: "riya.kapoor@outlook.com",
        contactPhone: "+91 98765 12340",
        status: "Lead Interested",
        callSummary: "The call successfully concluded with Arianna expressing her need for loan and asking for more details on it. The details have been sent over the email.",
        recordingUrl: "/recordings/call-8.mp3",
        transcriptUrl: "/transcripts/call-8.txt"
      },
      {
        campaignId: 1,
        contactName: "Suresh Patil",
        contactEmail: "suresh@yahoo.com",
        contactPhone: "+91 98234 56789",
        status: "Not Interested",
        callSummary: "Not interested in relocating at this time.",
        recordingUrl: "/recordings/call-9.mp3",
        transcriptUrl: "/transcripts/call-9.txt"
      },
      {
        campaignId: 1,
        contactName: "Arjun Singh",
        contactEmail: "arjun.singh@rediffmail.com",
        contactPhone: "+91 99345 67890",
        status: "Not Interested",
        callSummary: "Preferred different amenities than what was offered.",
        recordingUrl: "/recordings/call-10.mp3",
        transcriptUrl: "/transcripts/call-10.txt"
      },
      {
        campaignId: 1,
        contactName: "Neha Choudhury",
        contactEmail: "neha.ch@yahoo.com",
        contactPhone: "+91 98456 78901",
        status: "Not Interested",
        callSummary: "Not interested at this time.",
        recordingUrl: "/recordings/call-11.mp3",
        transcriptUrl: "/transcripts/call-11.txt"
      },
      {
        campaignId: 1,
        contactName: "Manish Reddy",
        contactEmail: "manish.reddy@gmail.com",
        contactPhone: "+91 97678 23456",
        status: "Need to follow up",
        callSummary: "Was busy, requested to call back next week.",
        recordingUrl: "/recordings/call-12.mp3",
        transcriptUrl: "/transcripts/call-12.txt"
      },
      {
        campaignId: 1,
        contactName: "Deepika Joshi",
        contactEmail: "deepika.joshi@outlook.com",
        contactPhone: "+91 98231 45678",
        status: "Not Interested",
        callSummary: "Looking for a different type of property.",
        recordingUrl: "/recordings/call-13.mp3",
        transcriptUrl: "/transcripts/call-13.txt"
      },
      {
        campaignId: 1,
        contactName: "Sanjay Gupta",
        contactEmail: "sanjay.gupta@hotmail.com",
        contactPhone: "+91 97785 43219",
        status: "Need to follow up",
        callSummary: "Requested more details about floor plans via email.",
        recordingUrl: "/recordings/call-14.mp3",
        transcriptUrl: "/transcripts/call-14.txt"
      }
    ];

    // Add sample call history records
    sampleCallRecords.forEach(record => this.createCallHistoryItem(record as InsertCallHistory));
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

  // Call History Methods
  async getCallHistory(): Promise<CallHistory[]> {
    return Array.from(this.callHistories.values());
  }

  async getCallHistoryByCampaign(campaignId: number): Promise<CallHistory[]> {
    return Array.from(this.callHistories.values()).filter(
      call => call.campaignId === campaignId
    );
  }

  async getCallHistoryByContact(contactEmail: string): Promise<CallHistory[]> {
    return Array.from(this.callHistories.values()).filter(
      call => call.contactEmail === contactEmail
    );
  }

  async getCallHistoryItem(id: number): Promise<CallHistory | undefined> {
    return this.callHistories.get(id);
  }

  async createCallHistoryItem(insertCallHistory: InsertCallHistory): Promise<CallHistory> {
    const id = this.callHistoryCurrentId++;
    const now = new Date();
    const callHistoryItem: CallHistory = {
      id,
      campaignId: typeof insertCallHistory.campaignId === 'number' ? insertCallHistory.campaignId : null,
      contactName: insertCallHistory.contactName,
      contactEmail: insertCallHistory.contactEmail,
      contactPhone: insertCallHistory.contactPhone,
      status: insertCallHistory.status,
      callDate: now,
      callSummary: insertCallHistory.callSummary ?? null,
      recordingUrl: insertCallHistory.recordingUrl ?? null,
      transcriptUrl: insertCallHistory.transcriptUrl ?? null
    };
    this.callHistories.set(id, callHistoryItem);
    return callHistoryItem;
  }

  async updateCallHistoryStatus(id: number, status: string): Promise<CallHistory | undefined> {
    const callHistory = this.callHistories.get(id);
    if (!callHistory) return undefined;

    const updatedCallHistory: CallHistory = {
      ...callHistory,
      status
    };

    this.callHistories.set(id, updatedCallHistory);
    return updatedCallHistory;
  }
}

export const storage = new MemStorage();