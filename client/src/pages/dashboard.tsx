import PageHeader from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const monthlyData = [
  { name: "Week 1", value: 15000 },
  { name: "Feb", value: 12000 },
  { name: "Mar", value: 18000 },
  { name: "Apr", value: 14000 },
  { name: "May", value: 16000 },
  { name: "Jun", value: 19000 },
  { name: "Jul", value: 20000 },
];

const deviceData = [
  { name: "Linux", value: 15000 },
  { name: "Mac", value: 16000 },
  { name: "iOS", value: 14000 },
  { name: "Windows", value: 17000 },
  { name: "Android", value: 8000 },
  { name: "Other", value: 16000 },
];

const locationData = [
  { name: "United States", value: 38.6 },
  { name: "Canada", value: 22.5 },
  { name: "Mexico", value: 30.8 },
  { name: "Other", value: 8.1 },
];

const COLORS = ['#8884d8', '#82ca9d', '#000000', '#8dd1e1', '#a4de6c', '#d0ed57'];
const LOCATION_COLORS = ['#6366f1', '#86efac', '#000000', '#e5e7eb'];

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

        {/* Total Users Chart */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value/1000}M`} />
                  <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} dot={false} />
                  <Tooltip />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Traffic by Device */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Traffic by Device</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={deviceData}>
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value/1000}M`} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {deviceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                    <Tooltip />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Traffic by Location */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Traffic by Location</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={locationData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name, value}) => `${name} ${value}%`}
                    >
                      {locationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={LOCATION_COLORS[index % LOCATION_COLORS.length]} />
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