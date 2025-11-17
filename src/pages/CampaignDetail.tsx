import AppShell from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Play, Download, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const CampaignDetail = () => {
  const { id } = useParams();

  const negotiationMessages = [
    {
      id: 1,
      actor: "brand",
      text: "We're offering SmartWatch X for ₹12,999 with advanced fitness tracking. We request location and sleep_patterns to enhance your experience.",
      time: "10:01 AM",
      sentiment: 0.0,
      confidence: 0.92
    },
    {
      id: 2,
      actor: "consumer",
      text: "Price seems high and I'm concerned about sharing sleep data. I'd accept if price is ₹8,500 or less and no sleep data collection.",
      time: "10:01 AM",
      sentiment: -0.4,
      confidence: 0.87
    },
    {
      id: 3,
      actor: "brand",
      text: "We understand your privacy concerns. We can offer the watch at ₹10,999 and we'll only collect anonymous activity data, not sleep patterns. This price includes a 2-year warranty.",
      time: "10:02 AM",
      sentiment: 0.3,
      confidence: 0.89
    },
    {
      id: 4,
      actor: "consumer",
      text: "That's a better offer. If you can go to ₹10,500 and include free shipping, I'll accept.",
      time: "10:02 AM",
      sentiment: 0.2,
      confidence: 0.91
    },
    {
      id: 5,
      actor: "brand",
      text: "Deal! ₹10,500 with free shipping and 2-year warranty. We'll only collect anonymous activity data.",
      time: "10:03 AM",
      sentiment: 0.5,
      confidence: 0.94
    },
    {
      id: 6,
      actor: "system",
      text: "✓ Negotiation completed successfully. Consumer accepted offer.",
      time: "10:03 AM",
      sentiment: 1.0,
      confidence: 1.0
    }
  ];

  const insights = [
    { label: "Predicted Acceptance", value: "78%", trend: "+5%" },
    { label: "Avg. Discount Needed", value: "19%", trend: "-2%" },
    { label: "Privacy Objections", value: "64%", trend: "↑" },
  ];

  return (
    <AppShell>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link to="/app/campaigns">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="mb-2">SmartWatch X Launch</h1>
            <div className="flex items-center gap-3">
              <Badge>Active</Badge>
              <span className="text-sm text-muted-foreground">Campaign #{id}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button>
              <Play className="mr-2 h-4 w-4" />
              Run Simulation
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Offer Card */}
          <Card className="p-6 lg:col-span-1">
            <h3 className="mb-4">Offer Details</h3>
            
            <div className="aspect-square bg-muted rounded-lg mb-4 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30" 
                alt="SmartWatch X"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg mb-1">SmartWatch X</h3>
                <p className="text-sm text-muted-foreground">Advanced fitness tracking, 7-day battery</p>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">₹12,999</span>
                <Badge variant="secondary">Premium</Badge>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Data Requested:</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs">
                    <AlertCircle className="mr-1 h-3 w-3" />
                    Location
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <AlertCircle className="mr-1 h-3 w-3" />
                    Sleep Patterns
                  </Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* Negotiation Timeline */}
          <Card className="p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h3>Negotiation Timeline</h3>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">Replay</Button>
                <Button variant="outline" size="sm">Explain</Button>
              </div>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {negotiationMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.actor === 'brand' ? 'flex-row' : msg.actor === 'system' ? 'justify-center' : 'flex-row-reverse'}`}
                >
                  {msg.actor !== 'system' && (
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback className={msg.actor === 'brand' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}>
                        {msg.actor === 'brand' ? 'B' : 'C'}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div className={`flex-1 max-w-[80%] ${msg.actor === 'system' ? 'max-w-full' : ''}`}>
                    {msg.actor !== 'system' && (
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium">
                          {msg.actor === 'brand' ? 'Brand Agent' : 'Consumer Agent'}
                        </span>
                        <span className="text-xs text-muted-foreground">{msg.time}</span>
                      </div>
                    )}
                    
                    <div
                      className={`p-4 rounded-lg ${
                        msg.actor === 'brand'
                          ? 'bg-primary/10 border border-primary/20'
                          : msg.actor === 'system'
                          ? 'bg-success/10 border border-success/20 text-center text-sm flex items-center justify-center gap-2'
                          : 'bg-muted border border-border'
                      }`}
                    >
                      {msg.actor === 'system' && <CheckCircle className="h-4 w-4 text-success" />}
                      <p className="text-sm">{msg.text}</p>
                    </div>

                    {msg.actor !== 'system' && (
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span>
                          Sentiment: {msg.sentiment > 0 ? '😊' : msg.sentiment < 0 ? '😟' : '😐'} {msg.sentiment.toFixed(1)}
                        </span>
                        <span>Confidence: {Math.round(msg.confidence * 100)}%</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Insights Panel */}
        <Card className="p-6">
          <h3 className="mb-6">Campaign Insights</h3>
          
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {insights.map((insight) => (
              <div key={insight.label} className="text-center p-4 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">{insight.label}</p>
                <div className="flex items-center justify-center gap-2">
                  <p className="text-3xl font-bold">{insight.value}</p>
                  <span className={`text-sm ${insight.trend.includes('+') || insight.trend.includes('↑') ? 'text-success' : 'text-muted-foreground'}`}>
                    {insight.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-primary" />
                Top Objections
              </h4>
              <div className="space-y-2">
                {[
                  { text: "Privacy concerns with data collection", count: 156 },
                  { text: "Price too high", count: 142 },
                  { text: "Prefer competitor brand", count: 89 },
                ].map((objection, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded text-sm">
                    <span>{objection.text}</span>
                    <Badge variant="secondary">{objection.count}</Badge>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-success" />
                Recommended Actions
              </h4>
              <div className="space-y-2">
                {[
                  "Reduce sleep data collection requirement",
                  "Offer 15-20% discount for price-sensitive personas",
                  "Emphasize privacy protection features",
                ].map((action, i) => (
                  <div key={i} className="p-3 bg-success/10 border border-success/20 rounded text-sm">
                    {action}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </AppShell>
  );
};

export default CampaignDetail;
