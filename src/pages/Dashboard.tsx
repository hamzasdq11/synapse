import AppShell from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Users, Megaphone, Activity, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import AcademicBanner from "@/components/AcademicBanner";

const Dashboard = () => {
  const stats = [
    { label: "Active Campaigns", value: "12", change: "+3 this week", icon: Megaphone, color: "text-primary" },
    { label: "Total Personas", value: "48", change: "+8 this month", icon: Users, color: "text-blue-500" },
    { label: "Avg Acceptance Rate", value: "67%", change: "+5% vs last month", icon: TrendingUp, color: "text-success" },
    { label: "Simulations Run", value: "1,247", change: "324 today", icon: Activity, color: "text-purple-500" },
  ];

  const recentNegotiations = [
    { id: 1, campaign: "SmartWatch X Launch", persona: "Urban Saver", outcome: "Accepted", acceptanceRate: 0.85, time: "2 hours ago" },
    { id: 2, campaign: "Eco-Friendly Bundle", persona: "Green Advocate", outcome: "Counter", acceptanceRate: 0.62, time: "4 hours ago" },
    { id: 3, campaign: "Premium Membership", persona: "Luxury Seeker", outcome: "Accepted", acceptanceRate: 0.91, time: "5 hours ago" },
  ];

  return (
    <AppShell>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your campaigns.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.label} className="p-6 hover:border-primary/50 transition-all group">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.change}</p>
                </div>
                <div className={cn("p-3 bg-muted/50 rounded-lg group-hover:bg-primary/10 transition-all", stat.color)}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Negotiations */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3>Recent Negotiations</h3>
              <Link to="/app/campaigns">
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="space-y-4">
              {recentNegotiations.map((neg) => (
                <div key={neg.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-all">
                  <div className="space-y-1 flex-1">
                    <p className="font-medium">{neg.campaign}</p>
                    <p className="text-sm text-muted-foreground">Persona: {neg.persona}</p>
                    <p className="text-xs text-muted-foreground">{neg.time}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <div className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium inline-block",
                      neg.outcome === "Accepted" 
                        ? "bg-success/10 text-success" 
                        : "bg-primary/10 text-primary"
                    )}>
                      {neg.outcome}
                    </div>
                    <p className="text-sm font-medium">{Math.round(neg.acceptanceRate * 100)}% rate</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="mb-6">Quick Actions</h3>
            
            <div className="space-y-3">
              <Link to="/app/campaigns">
                <Button className="w-full justify-start" variant="outline" size="lg">
                  <Megaphone className="mr-3 h-5 w-5" />
                  Create New Campaign
                </Button>
              </Link>
              
              <Link to="/app/personas">
                <Button className="w-full justify-start" variant="outline" size="lg">
                  <Users className="mr-3 h-5 w-5" />
                  Add Persona
                </Button>
              </Link>
              
              <Button className="w-full justify-start" variant="outline" size="lg">
                <Activity className="mr-3 h-5 w-5" />
                Run Simulation
              </Button>
              
              <Link to="/app/insights">
                <Button className="w-full justify-start" variant="outline" size="lg">
                  <TrendingUp className="mr-3 h-5 w-5" />
                  View Insights
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
      <AcademicBanner />
    </AppShell>
  );
};

// Helper function (add to utils if not present)
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

export default Dashboard;
