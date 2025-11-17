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

const Campaigns = () => {
  const campaigns = [
    {
      id: 1,
      name: "SmartWatch X Launch",
      status: "active",
      acceptanceRate: 0.85,
      lastRun: "2 hours ago",
      simulations: 342,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30"
    },
    {
      id: 2,
      name: "Eco-Friendly Bundle",
      status: "active",
      acceptanceRate: 0.67,
      lastRun: "1 day ago",
      simulations: 158,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff"
    },
    {
      id: 3,
      name: "Premium Membership",
      status: "draft",
      acceptanceRate: 0,
      lastRun: "Never",
      simulations: 0,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e"
    },
  ];

  return (
    <AppShell>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="mb-2">Campaigns</h1>
            <p className="text-muted-foreground">Manage and monitor your advertising campaigns</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Campaign
          </Button>
        </div>

        {/* Search & Filters */}
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search campaigns..."
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline">All Status</Button>
              <Button variant="outline">Sort by</Button>
            </div>
          </div>
        </Card>

        {/* Campaigns Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <Card key={campaign.id} className="overflow-hidden hover:border-primary/50 transition-all group">
              <div className="aspect-video overflow-hidden bg-muted">
                <img 
                  src={campaign.image} 
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
                      <DropdownMenuItem className="text-destructive">
                        <Archive className="mr-2 h-4 w-4" />
                        Archive
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Acceptance Rate</p>
                    <p className="text-xl font-bold text-success">
                      {campaign.status === "active" ? `${Math.round(campaign.acceptanceRate * 100)}%` : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Simulations</p>
                    <p className="text-xl font-bold">{campaign.simulations}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground">Last run: {campaign.lastRun}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
};

export default Campaigns;
