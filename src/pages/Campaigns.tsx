import { useState, useEffect } from "react";
import AppShell from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Play, Copy, Archive, MoreVertical } from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CampaignWizard from "@/components/CampaignWizard";
import { supabase } from "@/integrations/supabase/client";
import AcademicBanner from "@/components/AcademicBanner";

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [wizardOpen, setWizardOpen] = useState(false);

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    const { data } = await supabase
      .from("campaigns")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (data) setCampaigns(data);
  };

  const mockCampaigns = [
    {
      id: "demo-1",
      name: "SmartWatch X Launch",
      status: "active",
      acceptance_rate: 0.85,
      lastRun: "2 hours ago",
      simulations: 342,
      image_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30"
    },
    {
      id: "demo-2",
      name: "Eco-Friendly Bundle",
      status: "active",
      acceptance_rate: 0.67,
      lastRun: "1 day ago",
      simulations: 158,
      image_url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff"
    },
    {
      id: "demo-3",
      name: "Premium Membership",
      status: "draft",
      acceptance_rate: 0,
      lastRun: "Never",
      simulations: 0,
      image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e"
    },
  ];

  // Always show mock campaigns + user campaigns
  const displayCampaigns = [...mockCampaigns, ...campaigns];

  return (
    <AppShell>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="mb-2">Campaigns</h1>
            <p className="text-muted-foreground">Manage and monitor your advertising campaigns</p>
          </div>
          <Button onClick={() => setWizardOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Campaign
          </Button>
        </div>

        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search campaigns..." className="pl-10" />
            </div>
            <div className="flex gap-2">
              <Button variant="outline">All Status</Button>
              <Button variant="outline">Sort by</Button>
            </div>
          </div>
        </Card>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayCampaigns.map((campaign) => (
            <Card key={campaign.id} className="overflow-hidden hover:border-primary/50 transition-all group">
              <div className="aspect-video overflow-hidden bg-muted">
                <img 
                  src={campaign.image_url} 
                  alt={campaign.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <Link to={`/app/campaigns/${campaign.id}`}>
                      <h3 className="hover:text-primary transition-colors">{campaign.name}</h3>
                    </Link>
                    <Badge 
                      variant={campaign.status === "active" ? "default" : "secondary"}
                      className="mt-2"
                    >
                      {campaign.status}
                    </Badge>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Play className="mr-2 h-4 w-4" />
                        Run Simulation
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Archive className="mr-2 h-4 w-4" />
                        Archive
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Acceptance Rate</span>
                    <span className="font-semibold text-success">
                      {Math.round((campaign.acceptance_rate || 0) * 100)}%
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Simulations</span>
                    <span className="font-semibold">{campaign.simulations || 0}</span>
                  </div>
                  
                  <div className="text-xs text-muted-foreground pt-2 border-t">
                    Last run: {campaign.lastRun || campaign.updated_at || "Never"}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <CampaignWizard
          open={wizardOpen}
          onOpenChange={setWizardOpen}
          onSave={loadCampaigns}
        />
      </div>
      <AcademicBanner />
    </AppShell>
  );
};

export default Campaigns;
