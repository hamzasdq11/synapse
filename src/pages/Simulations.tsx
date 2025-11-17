import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, User, Package, TrendingUp, MessageSquare, Plus, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Default demo data
const defaultCampaigns = [
  {
    id: "demo-campaign-1",
    name: "SmartWatch X Launch",
    product_name: "SmartWatch X Pro",
    description: "Premium fitness tracker with 7-day battery and health monitoring",
    price: 12999,
    currency: "INR",
    status: "active",
    isDemo: true,
  },
  {
    id: "demo-campaign-2",
    name: "Eco-Friendly Bundle",
    product_name: "Sustainable Product Pack",
    description: "Eco-conscious products for environmentally aware consumers",
    price: 2499,
    currency: "INR",
    status: "active",
    isDemo: true,
  },
];

const defaultPersonas = [
  {
    id: "demo-persona-1",
    name: "Urban Saver",
    age: 28,
    location: "Bengaluru",
    income: 600000,
    trust_score: 0.72,
    price_sensitivity: 0.85,
    privacy_threshold: 0.65,
    ocean_scores: { openness: 0.6, conscientiousness: 0.8, extraversion: 0.4, agreeableness: 0.7, neuroticism: 0.2 },
    isDemo: true,
  },
  {
    id: "demo-persona-2",
    name: "Green Advocate",
    age: 34,
    location: "Mumbai",
    income: 1200000,
    trust_score: 0.85,
    price_sensitivity: 0.45,
    privacy_threshold: 0.70,
    ocean_scores: { openness: 0.8, conscientiousness: 0.7, extraversion: 0.6, agreeableness: 0.8, neuroticism: 0.3 },
    isDemo: true,
  },
  {
    id: "demo-persona-3",
    name: "Luxury Seeker",
    age: 42,
    location: "Delhi",
    income: 2500000,
    trust_score: 0.91,
    price_sensitivity: 0.25,
    privacy_threshold: 0.50,
    ocean_scores: { openness: 0.7, conscientiousness: 0.6, extraversion: 0.9, agreeableness: 0.6, neuroticism: 0.2 },
    isDemo: true,
  },
];

const Simulations = () => {
  const navigate = useNavigate();
  const [userCampaigns, setUserCampaigns] = useState<any[]>([]);
  const [userPersonas, setUserPersonas] = useState<any[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<string>("");
  const [selectedPersona, setSelectedPersona] = useState<string>("");
  const [simulations, setSimulations] = useState<any[]>([]);
  const [activeSimulation, setActiveSimulation] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Combine user data with defaults
  const campaigns = [...defaultCampaigns, ...userCampaigns];
  const personas = [...defaultPersonas, ...userPersonas];

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast.error("Please sign in to access simulations");
      navigate("/auth");
      return;
    }
    setIsAuthenticated(true);
    setCheckingAuth(false);
    loadData();
    loadSimulations();
  };

  const loadData = async () => {
    const { data: campaignsData } = await supabase
      .from("campaigns")
      .select("*")
      .order("created_at", { ascending: false });
    
    const { data: personasData } = await supabase
      .from("personas")
      .select("*")
      .order("created_at", { ascending: false });

    if (campaignsData) setUserCampaigns(campaignsData);
    if (personasData) setUserPersonas(personasData);
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

    const campaign = campaigns.find(c => c.id === selectedCampaign);
    const persona = personas.find(p => p.id === selectedPersona);

    if (!campaign || !persona) {
      toast.error("Selected campaign or persona not found");
      return;
    }

    setLoading(true);
    setActiveSimulation({
      status: "running",
      transcript: [],
      campaign,
      persona,
    });

    // Simulate progressive message loading for better UX
    const simulateProgress = () => {
      const messages = [
        { actor: 'brand', text: `Introducing ${campaign.product_name || campaign.name} for ₹${campaign.price}...`, sentiment: 0.5 },
        { actor: 'consumer', text: `Analyzing the offer based on my preferences...`, sentiment: 0 },
      ];
      
      setActiveSimulation((prev: any) => ({
        ...prev,
        transcript: messages,
      }));
    };

    setTimeout(simulateProgress, 500);

    try {
      // For demo campaigns/personas, simulate locally
      if (campaign.isDemo || persona.isDemo) {
        await simulateDemoNegotiation(campaign, persona);
      } else {
        // Real simulation via edge function
        const { data, error } = await supabase.functions.invoke("run-simulation", {
          body: {
            campaignId: selectedCampaign,
            personaId: selectedPersona,
          },
        });

        if (error) throw error;

        if (!data?.simulation) {
          throw new Error("Invalid response from simulation");
        }

        setActiveSimulation({
          ...data.simulation,
          status: "completed",
          campaign,
          persona,
        });
      }

      toast.success("Simulation completed!");
      await loadSimulations();
    } catch (error: any) {
      console.error("Simulation error:", error);
      toast.error(error.message || "Simulation failed. Please check your OpenAI API key in settings.");
      setActiveSimulation(null);
    } finally {
      setLoading(false);
    }
  };

  const simulateDemoNegotiation = async (campaign: any, persona: any) => {
    // Simulate a realistic negotiation based on persona traits
    await new Promise(resolve => setTimeout(resolve, 1500));

    const pricePoint = campaign.price;
    const sensitivity = persona.price_sensitivity;
    const trustScore = persona.trust_score;
    
    const transcript = [
      {
        actor: 'brand',
        text: `We're offering ${campaign.product_name} for ₹${pricePoint}. ${campaign.description}`,
        sentiment: 0.6,
      },
      {
        actor: 'consumer',
        text: sensitivity > 0.7 
          ? `The price seems high for my budget. I'm looking for something around ₹${Math.round(pricePoint * 0.7)}.`
          : `Interesting product. Can you tell me more about the features and warranty?`,
        sentiment: sensitivity > 0.7 ? -0.3 : 0.1,
      },
      {
        actor: 'brand',
        text: sensitivity > 0.7
          ? `I understand your concern. We can offer a 15% discount, bringing it to ₹${Math.round(pricePoint * 0.85)}.`
          : `It comes with a 2-year warranty and 24/7 customer support. Premium quality guaranteed.`,
        sentiment: 0.4,
      },
      {
        actor: 'consumer',
        text: trustScore > 0.8 && sensitivity < 0.5
          ? `That sounds perfect! I'll take it at ₹${Math.round(pricePoint * 0.85)}.`
          : sensitivity > 0.7
          ? `Still a bit steep. Can we meet at ₹${Math.round(pricePoint * 0.75)}?`
          : `Let me think about it. The warranty is good, but I need to compare with other options.`,
        sentiment: trustScore > 0.8 && sensitivity < 0.5 ? 0.8 : sensitivity > 0.7 ? -0.2 : 0.0,
      },
    ];

    const outcome = trustScore > 0.8 && sensitivity < 0.5 
      ? 'accepted' 
      : sensitivity > 0.7 
      ? 'counter' 
      : 'rejected';

    const acceptanceRate = outcome === 'accepted' ? 1 : outcome === 'counter' ? 0.5 : 0;

    setActiveSimulation({
      status: "completed",
      outcome,
      transcript,
      campaign,
      persona,
      metrics: {
        acceptanceRate,
        sentimentAvg: transcript.reduce((acc, m) => acc + (m.sentiment || 0), 0) / transcript.length,
      },
    });
  };

  const viewSimulation = (sim: any) => {
    setActiveSimulation({
      ...sim,
      campaign: sim.campaigns,
      persona: sim.personas,
    });
  };

  if (checkingAuth) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </AppShell>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

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
              <div className="flex items-center justify-between mb-4">
                <h3>Setup Simulation</h3>
                {(userCampaigns.length > 0 || userPersonas.length > 0) && (
                  <Badge variant="outline" className="text-xs">
                    {userCampaigns.length} custom campaigns, {userPersonas.length} custom personas
                  </Badge>
                )}
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Select Campaign</label>
                  <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a campaign" />
                    </SelectTrigger>
                    <SelectContent>
                      {defaultCampaigns.length > 0 && (
                        <>
                          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                            Demo Campaigns
                          </div>
                          {defaultCampaigns.map((campaign) => (
                            <SelectItem key={campaign.id} value={campaign.id}>
                              {campaign.name} (Demo)
                            </SelectItem>
                          ))}
                        </>
                      )}
                      {userCampaigns.length > 0 && (
                        <>
                          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                            Your Campaigns
                          </div>
                          {userCampaigns.map((campaign) => (
                            <SelectItem key={campaign.id} value={campaign.id}>
                              {campaign.name}
                            </SelectItem>
                          ))}
                        </>
                      )}
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
                      {defaultPersonas.length > 0 && (
                        <>
                          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                            Demo Personas
                          </div>
                          {defaultPersonas.map((persona) => (
                            <SelectItem key={persona.id} value={persona.id}>
                              {persona.name} (Demo)
                            </SelectItem>
                          ))}
                        </>
                      )}
                      {userPersonas.length > 0 && (
                        <>
                          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                            Your Personas
                          </div>
                          {userPersonas.map((persona) => (
                            <SelectItem key={persona.id} value={persona.id}>
                              {persona.name}
                            </SelectItem>
                          ))}
                        </>
                      )}
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

                  {loading && (!activeSimulation.transcript || activeSimulation.transcript.length === 0) ? (
                    <div className="text-center py-8">
                      <div className="animate-pulse space-y-3">
                        <div className="h-4 bg-muted rounded w-3/4 mx-auto"></div>
                        <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
                        <div className="h-4 bg-muted rounded w-5/6 mx-auto"></div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-4">AI agents negotiating...</p>
                    </div>
                  ) : activeSimulation.transcript && activeSimulation.transcript.length > 0 ? (
                    <div className="space-y-3 max-h-[400px] overflow-y-auto">
                      {activeSimulation.transcript.map((message: any, idx: number) => (
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
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No messages yet</p>
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
