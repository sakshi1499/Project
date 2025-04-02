import PageHeader from "@/components/layout/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Phone, Users, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const data = [
  { name: "Mon", calls: 40 },
  { name: "Tue", calls: 30 },
  { name: "Wed", calls: 60 },
  { name: "Thu", calls: 45 },
  { name: "Fri", calls: 70 },
  { name: "Sat", calls: 25 },
  { name: "Sun", calls: 15 },
];

const Dashboard = () => {
  const { data: campaigns, isLoading } = useQuery({
    queryKey: ["/api/campaigns"],
  });

  const activeCampaigns = campaigns?.filter((campaign: any) => campaign.status) || [];
  const totalCalls = campaigns?.reduce((acc: number, curr: any) => acc + curr.maxCallCount, 0) || 0;

  return (
    <div>
      <PageHeader title="Dashboard" showSearch />
      
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Campaigns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">
                  {isLoading ? "..." : campaigns?.length || 0}
                </div>
                <Phone className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Campaigns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">
                  {isLoading ? "..." : activeCampaigns.length}
                </div>
                <CheckCircle className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Calls
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">
                  {isLoading ? "..." : totalCalls}
                </div>
                <Users className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Call Activity</CardTitle>
            <CardDescription>Weekly overview of voice call activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <XAxis dataKey="name" tickLine={false} axisLine={false} />
                  <YAxis 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(value) => `${value}`} 
                  />
                  <Tooltip cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} />
                  <Bar 
                    dataKey="calls" 
                    fill="hsl(var(--primary))" 
                    radius={[4, 4, 0, 0]} 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end">
          <Link href="/campaigns">
            <Button>
              Manage Campaigns
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
