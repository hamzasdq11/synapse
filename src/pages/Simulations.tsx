import { useState, useEffect } from "react";
import AppShell from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, User, Package, TrendingUp, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Simulations = () => {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [personas, setPersonas] = useState<any[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<string>("");
  const [selectedPersona, setSelectedPersona] = useState<string>("");
  const [simulations, setSimulations] = useState<any[]>([]);
  const [activeSimulation, setActiveSimulation] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
    loadSimulations();
  }, []);

  const loadData = async () => {
    const { data: campaignsData } = await supabase
      .from("campaigns")
      .select("*")
      .order("created_at", { ascending: false });
    
    const { data: personasData } = await supabase
      .from("personas")
      .select("*")
      .order("created_at", { ascending: false });

    if (campaignsData) setCampaigns(campaignsData);
    if (personasData) setPersonas(personasData);
  };

  const loadSimulations = async () => {
    const { data } = await supabase
      .from("simulations")
      .select(`
        *,
        campaigns:campaign_id (name, product_name),
        personas:persona_id (name)
      `)
      .order("created_at", { ascending: false })
      .limit(10);

    if (data) setSimulations(data);
  };

  const runSimulation = async () => {
    if (!selectedCampaign || !selectedPersona) {
      toast.error("Please select both a campaign and a persona");
      return;
    }

    setLoading(true);
    setActiveSimulation({
      status: "running",
      transcript: [],
      campaign: campaigns.find(c => c.id === selectedCampaign),
      persona: personas.find(p => p.id === selectedPersona),
    });

    try {
      const { data, error } = await supabase.functions.invoke("run-simulation", {
        body: {
          campaignId: selectedCampaign,
          personaId: selectedPersona,
        },
      });

      if (error) throw error;

      setActiveSimulation({
        ...data.simulation,
        status: "completed",
        campaign: campaigns.find(c => c.id === selectedCampaign),
        persona: personas.find(p => p.id === selectedPersona),
      });

      toast.success("Simulation completed!");
      loadSimulations();
    } catch (error: any) {
      console.error("Simulation error:", error);
      toast.error(error.message || "Simulation failed");
      setActiveSimulation(null);
    } finally {
      setLoading(false);
    }
  };

  const viewSimulation = (sim: any) => {
    setActiveSimulation({
      ...sim,
      campaign: sim.campaigns,
      persona: sim.personas,
    });
  };

  return (
    <AppShell>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="mb-2">Simulations</h1>
          <p className="text-muted-foreground">Run AI-powered negotiations and view results</p>
        </div>

        <Tabs defaultValue="run" className="space-y-6">
          <TabsList>
            <TabsTrigger value="run">Run Simulation</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="run" className="space-y-6">
            <Card className="p-6">
              <h3 className="mb-4">Setup Simulation</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Select Campaign</label>
                  <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a campaign" />
                    </SelectTrigger>
                    <SelectContent>
                      {campaigns.map((campaign) => (
                        <SelectItem key={campaign.id} value={campaign.id}>
                          {campaign.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Select Persona</label>
                  <Select value={selectedPersona} onValueChange={setSelectedPersona}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a persona" />
                    </SelectTrigger>
                    <SelectContent>
                      {personas.map((persona) => (
                        <SelectItem key={persona.id} value={persona.id}>
                          {persona.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                className="mt-4"
                onClick={runSimulation}
                disabled={!selectedCampaign || !selectedPersona || loading}
              >
                <Play className="mr-2 h-4 w-4" />
                {loading ? "Running Simulation..." : "Run Simulation"}
              </Button>
            </Card>

            {activeSimulation && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3>Live Negotiation</h3>
                  <Badge variant={
                    activeSimulation.status === "running" ? "default" :
                    activeSimulation.outcome === "accepted" ? "default" :
                    activeSimulation.outcome === "counter" ? "secondary" : "destructive"
                  }>
                    {activeSimulation.status === "running" ? "In Progress" : activeSimulation.outcome || "Result"}
                  </Badge>
                </div>

                {/* Campaign & Persona Info */}
                <div className="grid md:grid-cols-2 gap-4 mb-6 p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Package className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="text-sm text-muted-foreground">Campaign</p>
                      <p className="font-semibold">{activeSimulation.campaign?.name}</p>
                      <p className="text-sm">{activeSimulation.campaign?.product_name}</p>
                      {activeSimulation.campaign?.price && (
                        <p className="text-sm text-muted-foreground">
                          ₹{activeSimulation.campaign.price}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="text-sm text-muted-foreground">Persona</p>
                      <p className="font-semibold">{activeSimulation.persona?.name}</p>
                      {activeSimulation.persona?.age && (
                        <p className="text-sm">{activeSimulation.persona.age} years, {activeSimulation.persona.location}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Negotiation Transcript */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <MessageSquare className="h-4 w-4" />
                    <span>Negotiation Transcript</span>
                  </div>

                  {loading && activeSimulation.transcript.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="animate-pulse space-y-3">
                        <div className="h-4 bg-muted rounded w-3/4 mx-auto"></div>
                        <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
                        <div className="h-4 bg-muted rounded w-5/6 mx-auto"></div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-4">AI agents negotiating...</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[400px] overflow-y-auto">
                      {(activeSimulation.transcript || []).map((message: any, idx: number) => (
                        <div
                          key={idx}
                          className={`flex ${message.actor === 'brand' ? 'justify-start' : 'justify-end'} animate-in slide-in-from-bottom-2`}
                        >
                          <div
                            className={`max-w-[80%] p-4 rounded-lg ${
                              message.actor === 'brand'
                                ? 'bg-primary/10 border border-primary/20'
                                : 'bg-muted border border-border'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-semibold uppercase">
                                {message.actor === 'brand' ? '🏢 Brand Agent' : '👤 Consumer Agent'}
                              </span>
                              {message.sentiment !== undefined && (
                                <Badge variant="outline" className="text-xs">
                                  {message.sentiment > 0.3 ? '😊' : message.sentiment < -0.3 ? '😠' : '😐'}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm">{message.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Metrics */}
                {activeSimulation.metrics && activeSimulation.status === "completed" && (
                  <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      <span className="text-sm font-semibold">Simulation Metrics</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Acceptance Rate</p>
                        <p className="text-lg font-bold text-success">
                          {Math.round((activeSimulation.metrics.acceptanceRate || 0) * 100)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Avg Sentiment</p>
                        <p className="text-lg font-bold">
                          {(activeSimulation.metrics.sentimentAvg || 0).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            {simulations.map((sim) => (
              <Card
                key={sim.id}
                className="p-6 hover:border-primary/50 transition-all cursor-pointer"
                onClick={() => viewSimulation(sim)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4>{sim.campaigns?.name || "Campaign"}</h4>
                      <Badge variant={
                        sim.outcome === "accepted" ? "default" :
                        sim.outcome === "counter" ? "secondary" : "destructive"
                      }>
                        {sim.outcome || "pending"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      vs {sim.personas?.name || "Persona"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(sim.created_at).toLocaleString()}
                    </p>
                  </div>
                  
                  <Button variant="ghost" size="sm">
                    View Details
                  </Button>
                </div>
              </Card>
            ))}

            {simulations.length === 0 && (
              <Card className="p-12 text-center">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No simulations yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Run your first simulation to see it here
                </p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
};

export default Simulations;
