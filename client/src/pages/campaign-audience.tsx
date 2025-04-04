import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ChevronLeft } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Mock audience data
const mockContacts = [
  { id: 1, name: "John Smith", phone: "+1 (555) 123-4567", email: "john.smith@example.com", status: "Lead" },
  { id: 2, name: "Emily Johnson", phone: "+1 (555) 234-5678", email: "emily.johnson@example.com", status: "Client" },
  { id: 3, name: "Michael Brown", phone: "+1 (555) 345-6789", email: "michael.brown@example.com", status: "Lead" },
  { id: 4, name: "Sarah Davis", phone: "+1 (555) 456-7890", email: "sarah.davis@example.com", status: "Prospect" },
  { id: 5, name: "David Wilson", phone: "+1 (555) 567-8901", email: "david.wilson@example.com", status: "Lead" },
  { id: 6, name: "Jessica Taylor", phone: "+1 (555) 678-9012", email: "jessica.taylor@example.com", status: "Client" },
  { id: 7, name: "Kevin Martinez", phone: "+1 (555) 789-0123", email: "kevin.martinez@example.com", status: "Prospect" },
  { id: 8, name: "Amanda Thomas", phone: "+1 (555) 890-1234", email: "amanda.thomas@example.com", status: "Lead" },
];

export default function CampaignAudience() {
  const [_, setLocation] = useLocation();
  const [campaignTitle] = useState("Construction Campaign");
  const [selectedContacts, setSelectedContacts] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter contacts based on search query
  const filteredContacts = mockContacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.phone.includes(searchQuery)
  );
  
  // Handle contact selection
  const toggleContactSelection = (contactId: number) => {
    setSelectedContacts(prev => 
      prev.includes(contactId)
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };
  
  // Handle select all
  const toggleSelectAll = () => {
    if (selectedContacts.length === filteredContacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(filteredContacts.map(contact => contact.id));
    }
  };
  
  // Count selected contacts
  const selectedCount = selectedContacts.length;
  
  return (
    <div className="flex flex-col h-full">
      {/* Header bar */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/campaign-create")}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">{campaignTitle}</h1>
          <Button variant="ghost" size="icon" onClick={() => {}}>
            <span className="sr-only">Edit</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
              <path d="m15 5 4 4" />
            </svg>
          </Button>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex border-b">
        <div className="flex-1 text-center py-3 text-muted-foreground">
          <span className="inline-flex items-center">
            <svg
              className="mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            Craft your Message
          </span>
        </div>
        <div className="flex-1 text-center py-3 border-b-2 border-primary">
          <span className="inline-flex items-center">
            <svg
              className="mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            Add your audience
          </span>
        </div>
        <div className="flex-1 text-center py-3 text-muted-foreground">
          <span className="inline-flex items-center">
            <svg
              className="mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            Configure & Launch
          </span>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold">{selectedCount}</CardTitle>
              <CardDescription>Contacts Selected</CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold">{mockContacts.length}</CardTitle>
              <CardDescription>Total Contacts</CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold">
                {Math.round((selectedCount / mockContacts.length) * 100) || 0}%
              </CardTitle>
              <CardDescription>Selection Rate</CardDescription>
            </CardHeader>
          </Card>
        </div>
        
        <div className="mb-4">
          <div className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <Input
              className="pl-10"
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <div className="flex items-center">
                    <Checkbox
                      checked={
                        filteredContacts.length > 0 &&
                        selectedContacts.length === filteredContacts.length
                      }
                      onCheckedChange={toggleSelectAll}
                    />
                  </div>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContacts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                    No contacts found
                  </TableCell>
                </TableRow>
              ) : (
                filteredContacts.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedContacts.includes(contact.id)}
                        onCheckedChange={() => toggleContactSelection(contact.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{contact.name}</TableCell>
                    <TableCell>{contact.phone}</TableCell>
                    <TableCell>{contact.email}</TableCell>
                    <TableCell>{contact.status}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      {/* Footer */}
      <div className="flex justify-between p-4 border-t">
        <Button
          variant="outline"
          onClick={() => setLocation("/campaign-create")}
        >
          Back
        </Button>
        <Button onClick={() => setLocation("/campaign-configure")} disabled={selectedContacts.length === 0}>
          Next: Configure & Launch
        </Button>
      </div>
    </div>
  );
}