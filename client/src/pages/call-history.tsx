import PageHeader from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Phone, Clock, User } from "lucide-react";

// Placeholder data for call history
const callHistoryData = [
  { id: 1, campaignName: "Construction Campaign", recipient: "John Smith", duration: "2m 45s", status: "Completed", timestamp: "12/08/23 - 13:32PM" },
  { id: 2, campaignName: "Urban Nest Site Visit Drive", recipient: "Jane Doe", duration: "1m 15s", status: "Completed", timestamp: "12/08/23 - 14:05PM" },
  { id: 3, campaignName: "Construction Campaign", recipient: "Michael Brown", duration: "3m 10s", status: "No Answer", timestamp: "12/08/23 - 14:30PM" },
  { id: 4, campaignName: "The Pinnacle Residency Tour", recipient: "Sarah Wilson", duration: "4m 22s", status: "Completed", timestamp: "12/08/23 - 15:15PM" },
  { id: 5, campaignName: "Construction Campaign", recipient: "David Johnson", duration: "0m 45s", status: "Declined", timestamp: "12/08/23 - 16:00PM" },
];

const CallHistory = () => {
  return (
    <div>
      <PageHeader title="Call History" showSearch />
      
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Calls
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">1,702</div>
                <Phone className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Average Duration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">2m 35s</div>
                <Clock className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completion Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">78%</div>
                <User className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Calls</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {callHistoryData.map((call) => (
                  <TableRow key={call.id}>
                    <TableCell className="font-medium">{call.campaignName}</TableCell>
                    <TableCell>{call.recipient}</TableCell>
                    <TableCell>{call.duration}</TableCell>
                    <TableCell>{call.status}</TableCell>
                    <TableCell>{call.timestamp}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CallHistory;
