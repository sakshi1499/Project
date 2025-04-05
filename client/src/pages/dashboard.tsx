import PageHeader from "@/components/layout/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Phone, Percent, Users, ArrowUpRight, ThumbsUp, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "wouter";

// Sample data for the dashboard
const monthlyLeadsData = [
  { name: "Jan", leads: 1900, fill: "#a3a0fb" },
  { name: "Feb", leads: 2300, fill: "#a5e9c8" },
  { name: "Mar", leads: 1800, fill: "#a3a0fb" },
  { name: "Apr", leads: 2500, fill: "#a0d2fb" },
  { name: "May", leads: 900, fill: "#a3a0fb" },
  { name: "Jun", leads: 2200, fill: "#a5e9c8" },
];

const frequentResponses = [
  { question: "What is the location of the property?", percentage: 40 },
  { question: "What is the SFT price?", percentage: 55 },
  { question: "Is there any bulk deal?", percentage: 2 },
  { question: "Not interested now", percentage: 20 },
];

const highValueWords = [
  { word: "Exclusive", icon: "👍" },
  { word: "Limited-time", icon: "👍" },
  { word: "Premium", icon: "👍" },
  { word: "Luxury", icon: "👍" },
];

const lowValueWords = [
  { word: "Good deal", icon: "👎" },
  { word: "Interesting", icon: "👎" },
  { word: "Probably", icon: "👎" },
];

const campaignStatusData = {
  hotLeads: 25,
  interested: 35,
  notConnected: 20,
  notInterested: 10,
  followUp: 5,
  pending: 5,
  total: 100,
};

const Dashboard = () => {
  const { data: campaigns, isLoading } = useQuery({
    queryKey: ["/api/campaigns"],
  });

  // Calculate for demo dashboard
  const totalCalls = 438;
  const conversionRate = 40;
  const totalLeads = 177;
  const followUp = 40;

  return (
    <div className="pb-8">
      <PageHeader title="Dashboard" />
      
      <div className="p-4 md:p-8">
        <div className="flex justify-end gap-2 mb-6">
          <Select defaultValue="lastWeek">
            <SelectTrigger className="w-[140px] bg-card border-muted">
              <SelectValue placeholder="Filter by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lastWeek">Last Week</SelectItem>
              <SelectItem value="lastMonth">Last Month</SelectItem>
              <SelectItem value="lastYear">Last Year</SelectItem>
            </SelectContent>
          </Select>
          
          <Select defaultValue="construction">
            <SelectTrigger className="w-[200px] bg-card border-muted">
              <SelectValue placeholder="Campaign" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="construction">Construction Campaign</SelectItem>
              <SelectItem value="realEstate">Real Estate Campaign</SelectItem>
              <SelectItem value="all">All Campaigns</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-card border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Calls
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {totalCalls}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Conversion Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {conversionRate}%
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Leads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {totalLeads}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Follow Up
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {followUp}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Monthly Leads Chart */}
        <Card className="bg-card border-none shadow-sm mb-6">
          <CardHeader className="pb-2">
            <CardTitle>Leads per Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyLeadsData}>
                  <XAxis dataKey="name" tickLine={false} axisLine={false} />
                  <YAxis 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(value) => `${value}`} 
                    domain={[0, 3000]}
                    ticks={[0, 1500, 3000]}
                  />
                  <Tooltip cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} />
                  <Bar 
                    dataKey="leads" 
                    fill="#a3a0fb" 
                    radius={[4, 4, 0, 0]}
                    barSize={35}
                    fillOpacity={0.9}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Campaign Overview */}
        <Card className="bg-card border-none shadow-sm mb-6">
          <CardHeader className="pb-2">
            <CardTitle>Campaign Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mt-2">
              <div className="flex w-full h-5 mb-2 overflow-hidden rounded-full">
                <div 
                  className="bg-green-600" 
                  style={{ width: `${campaignStatusData.hotLeads}%` }}
                />
                <div 
                  className="bg-green-200" 
                  style={{ width: `${campaignStatusData.interested}%` }} 
                />
                <div 
                  className="bg-red-300" 
                  style={{ width: `${campaignStatusData.notConnected}%` }} 
                />
                <div 
                  className="bg-red-500" 
                  style={{ width: `${campaignStatusData.notInterested}%` }} 
                />
                <div 
                  className="bg-orange-400" 
                  style={{ width: `${campaignStatusData.followUp}%` }} 
                />
                <div 
                  className="bg-gray-300" 
                  style={{ width: `${campaignStatusData.pending}%` }} 
                />
              </div>
              <div className="flex justify-between px-4 text-xs text-muted-foreground mt-4">
                <span>Hot Leads ({campaignStatusData.hotLeads}%)</span>
                <span>Interested ({campaignStatusData.interested}%)</span>
                <span>Not Connected ({campaignStatusData.notConnected}%)</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Frequent Responses */}
          <Card className="bg-card border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle>Frequent responses from Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 text-sm font-medium">
                  <div>Questions</div>
                  <div>Percentage</div>
                </div>
                {frequentResponses.map((item, index) => (
                  <div key={index} className="grid grid-cols-2 text-sm border-t pt-2">
                    <div>{item.question}</div>
                    <div>{item.percentage}%</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Script Analysis */}
          <Card className="bg-card border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle>Script Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="mb-2 text-sm font-medium">High value words</div>
                  <div className="space-y-2">
                    {highValueWords.map((item, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <span className="mr-2">{item.icon}</span>
                        <span>{item.word}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="mb-2 text-sm font-medium">Low Value words</div>
                  <div className="space-y-2">
                    {lowValueWords.map((item, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <span className="mr-2">{item.icon}</span>
                        <span>{item.word}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
