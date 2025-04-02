import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertCampaignSchema } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Campaign } from "@shared/schema";

// Extend the schema with validation
const formSchema = insertCampaignSchema.extend({
  name: z.string().min(1, "Campaign name is required"),
  script: z.string().min(1, "Voice script is required"),
  maxCallCount: z.number().min(1, "Maximum call count must be at least 1"),
});

interface CampaignFormProps {
  isOpen: boolean;
  onClose: () => void;
  campaignToEdit?: Campaign;
}

const CampaignForm = ({ isOpen, onClose, campaignToEdit }: CampaignFormProps) => {
  const { toast } = useToast();
  const isEditing = !!campaignToEdit;

  // Default values for the form
  const defaultValues = isEditing 
    ? { ...campaignToEdit } 
    : {
        name: "",
        script: "",
        voiceType: "Default Voice (Male)",
        maxCallCount: 100,
        status: false,
        createdBy: 1, // Hardcoded for demo
      };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { formState } = form;
  const isSubmitting = formState.isSubmitting;

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      if (isEditing) {
        await apiRequest("PATCH", `/api/campaigns/${campaignToEdit.id}`, data);
        toast({
          title: "Campaign updated",
          description: "Your campaign has been updated successfully",
        });
      } else {
        await apiRequest("POST", "/api/campaigns", data);
        toast({
          title: "Campaign created",
          description: "Your new campaign has been created successfully",
        });
      }
      
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] });
      onClose();
      form.reset(defaultValues);
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "create"} campaign`,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Campaign" : "Create New Voice Campaign"}</DialogTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-4 top-4" 
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Campaign Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter campaign name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="script"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Voice Script</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter the script for the voice agent to follow" 
                      rows={4} 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="voiceType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Voice Selection</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a voice" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Default Voice (Male)">Default Voice (Male)</SelectItem>
                      <SelectItem value="Default Voice (Female)">Default Voice (Female)</SelectItem>
                      <SelectItem value="Custom Voice 1">Custom Voice 1</SelectItem>
                      <SelectItem value="Custom Voice 2">Custom Voice 2</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="maxCallCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Call Count</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min={1}
                      placeholder="Enter maximum call count" 
                      {...field} 
                      onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 1)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Future: Advanced Settings Button 
            <div className="pt-2">
              <button type="button" className="text-primary text-sm font-medium flex items-center">
                <span>Advanced Settings</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            */}
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting}
              >
                {isEditing ? "Update" : "Create"} Campaign
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CampaignForm;
