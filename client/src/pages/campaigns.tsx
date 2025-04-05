import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import PageHeader from "@/components/layout/page-header";
import CampaignTable from "@/components/campaigns/campaign-table";
import CampaignForm from "@/components/campaigns/campaign-form";
import { Button } from "@/components/ui/button";
import type { Campaign } from "@shared/schema";

const Campaigns = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [campaignToEdit, setCampaignToEdit] = useState<Campaign | undefined>(undefined);
  const [_, setLocation] = useLocation();

  const { data: campaigns, isLoading } = useQuery<Campaign[]>({
    queryKey: ["/api/campaigns"],
  });

  const handleEditCampaign = (campaign: Campaign) => {
    setLocation(`/campaign-create?id=${campaign.id}`);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setCampaignToEdit(undefined);
  };

  return (
    <div>
      <PageHeader title="Voice Campaigns" showSearch>
        <Button
          onClick={() => {
            setLocation("/campaign-create");
          }}
        >
          Create New Campaign
        </Button>
      </PageHeader>

      {/* Campaign Listing Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-6">
        <CampaignTable 
          campaigns={campaigns || []} 
          isLoading={isLoading}
          onEditCampaign={handleEditCampaign}
        />
      </section>

      {/* Campaign Form Dialog */}
      <CampaignForm 
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        campaignToEdit={campaignToEdit}
      />
    </div>
  );
};

export default Campaigns;