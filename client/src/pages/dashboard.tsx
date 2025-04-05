
import PageHeader from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone, UserCheck, Clock, TrendingUp } from "lucide-react";

const monthlyLeadsData = [
  { name: "Jan", leads: 45 },
  { name: "Feb", leads: 52 },
  { name: "Mar", leads: 38 },
  { name: "Apr", leads: 65 },
  { name: "May", leads: 48 },
  { name: "Jun", leads: 59 },
  { name: "Jul", leads: 42 },
];

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="Dashboard" />

      <div className="p-6">
        <div className="flex justify-end gap-4 mb-6">
          <Select defaultValue="month">
            <SelectTrigger className="w-[160px] bg-card border-border">
              <SelectValue placeholder="This month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">This month</SelectItem>
              <SelectItem value="last">Last month</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Calls
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">1,247</div>
                <Phone className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Leads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">349</div>
                <UserCheck className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Follow Up
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">124</div>
                <Clock className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Conversion Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">28%</div>
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Leads per Month Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Leads per Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyLeadsData}>
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <Bar dataKey="leads" fill="#8884d8" radius={[4, 4, 0, 0]} />
                    <Tooltip />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Campaign Overview Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Campaign Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Hot Leads', value: 25, color: '#FF6B6B' },
                        { name: 'Interested', value: 35, color: '#4ECDC4' },
                        { name: 'Not Connected', value: 15, color: '#95A5A6' },
                        { name: 'Not Interested', value: 10, color: '#E74C3C' },
                        { name: 'Follow Up', value: 20, color: '#F39C12' },
                        { name: 'Pending', value: 15, color: '#BDC3C7' }
                      ]}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={(entry) => `${entry.name}: ${entry.value}%`}
                    >
                      {[
                        { name: 'Hot Leads', value: 25, color: '#FF6B6B' },
                        { name: 'Interested', value: 35, color: '#4ECDC4' },
                        { name: 'Not Connected', value: 15, color: '#95A5A6' },
                        { name: 'Not Interested', value: 10, color: '#E74C3C' },
                        { name: 'Follow Up', value: 20, color: '#F39C12' },
                        { name: 'Pending', value: 15, color: '#BDC3C7' }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
