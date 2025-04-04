import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Campaign } from "@shared/schema";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ChevronLeft, Upload, Trash2, Pencil, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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
import Waveform from "@/components/ui/waveform";

// Mock audience data
const mockContacts = [
  { id: 1, name: "Rahul Sharma", phone: "+91 98765 43210", email: "rahul.sharma@example.com", status: "Contact" },
  { id: 2, name: "Priya Patel", phone: "+91 87654 32109", email: "priya.patel@example.com", status: "Client" },
  { id: 3, name: "Amit Kumar", phone: "+91 76543 21098", email: "amit.kumar@example.com", status: "Contact" },
  { id: 4, name: "Neha Singh", phone: "+91 65432 10987", email: "neha.singh@example.com", status: "Contact" },
  { id: 5, name: "Vikram Mehta", phone: "+91 54321 09876", email: "vikram.mehta@example.com", status: "Contact" },
  { id: 6, name: "Sneha Reddy", phone: "+91 43210 98765", email: "sneha.reddy@example.com", status: "Client" },
  { id: 7, name: "Karan Malhotra", phone: "+91 32109 87654", email: "karan.malhotra@example.com", status: "Contact" },
  { id: 8, name: "Anjali Gupta", phone: "+91 21098 76543", email: "anjali.gupta@example.com", status: "Contact" },
];

export default function CampaignAudience() {
  const [location, setLocation] = useLocation();
  const [campaignTitle, setCampaignTitle] = useState("Construction Campaign");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Extract campaign ID from URL if provided for editing
  const searchParams = new URLSearchParams(window.location.search);
  const campaignId = searchParams.get('id') ? parseInt(searchParams.get('id') as string) : undefined;
  
  // Load campaign data if editing an existing campaign
  const { data: campaignData } = useQuery<Campaign>({
    queryKey: ['/api/campaigns', campaignId],
    queryFn: async () => {
      if (!campaignId) return null;
      const response = await fetch(`/api/campaigns/${campaignId}`);
      if (!response.ok) throw new Error('Failed to load campaign');
      return response.json();
    },
    enabled: !!campaignId
  });
  
  // Update state with campaign data when loaded
  useEffect(() => {
    if (campaignData) {
      setCampaignTitle(campaignData.name || "Construction Campaign");
    }
  }, [campaignData]);
  
  const [selectedContacts, setSelectedContacts] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [contacts, setContacts] = useState(mockContacts);
  
  // Handle file upload trigger
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // This is a mock implementation. In a real app, we'd parse the Excel file
    // For now, we'll just show a success message
    toast({
      title: "File uploaded successfully",
      description: `File "${file.name}" has been processed. 8 new contacts imported.`,
    });
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Handle contact deletion
  const handleDeleteSelected = () => {
    if (selectedContacts.length === 0) return;
    
    const newContacts = contacts.filter(contact => !selectedContacts.includes(contact.id));
    setContacts(newContacts);
    setSelectedContacts([]);
    
    toast({
      title: `${selectedContacts.length} contacts deleted`,
      description: "The selected contacts have been removed from your audience.",
    });
  };
  
  // Filter contacts based on search query
  const filteredContacts = contacts.filter(contact => 
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
            onClick={() => setLocation(campaignId ? `/campaign-create?id=${campaignId}` : "/campaign-create")}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          {isEditingTitle ? (
            <div className="flex items-center gap-1">
              <Input
                className="h-8 w-60"
                value={campaignTitle}
                onChange={(e) => setCampaignTitle(e.target.value)}
                autoFocus
                onBlur={() => setIsEditingTitle(false)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setIsEditingTitle(false);
                  }
                }}
              />
              <Button variant="ghost" size="icon" onClick={() => setIsEditingTitle(false)}>
                <Check className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <>
              <h1 className="text-xl font-bold">{campaignTitle}</h1>
              <Button variant="ghost" size="icon" onClick={() => setIsEditingTitle(true)}>
                <Pencil className="h-4 w-4" />
              </Button>
            </>
          )}
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
      <div className="flex-1 p-4 overflow-y-auto relative">
        {/* Waveform decorations */}
        <Waveform position="left" />
        <Waveform position="right" />
        
        <div className="grid grid-cols-3 gap-4 mb-6 relative z-10">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold">{selectedCount}</CardTitle>
              <CardDescription>Contacts Selected</CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold">{contacts.length}</CardTitle>
              <CardDescription>Total Contacts</CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold">
                {Math.round((selectedCount / contacts.length) * 100) || 0}%
              </CardTitle>
              <CardDescription>Selection Rate</CardDescription>
            </CardHeader>
          </Card>
        </div>
        
        <div className="mb-4">
          <div className="flex gap-3 items-center">
            <div className="relative flex-1">
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
            
            {/* Hidden file input */}
            <input 
              type="file" 
              accept=".xlsx,.xls,.csv" 
              ref={fileInputRef} 
              className="hidden"
              onChange={handleFileUpload}
            />
            
            {/* Upload button */}
            <Button 
              variant="outline" 
              onClick={handleUploadClick}
              className="flex gap-1 items-center"
            >
              <Upload className="h-4 w-4 mr-1" />
              Import Excel
            </Button>
            
            {/* Delete button */}
            <Button 
              variant="outline" 
              onClick={handleDeleteSelected}
              className="flex gap-1 items-center"
              disabled={selectedContacts.length === 0}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
        
        <div className="rounded-md border overflow-hidden">
          <div className="max-h-[550px] overflow-y-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10">
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
                    <TableCell colSpan={5} className="text-center py-28 text-muted-foreground">
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
      </div>
      
      {/* Footer */}
      <div className="flex justify-between p-4 border-t">
        <Button
          variant="outline"
          onClick={() => setLocation(campaignId ? `/campaign-create?id=${campaignId}` : "/campaign-create")}
        >
          Back
        </Button>
        <Button 
          onClick={() => setLocation(campaignId ? 
            `/campaign-configure?id=${campaignId}` : 
            "/campaign-configure")} 
          disabled={selectedContacts.length === 0}
        >
          Next: {campaignId ? "Update" : "Configure"} & Launch
        </Button>
      </div>
    </div>
  );
}