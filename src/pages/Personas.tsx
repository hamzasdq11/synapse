import { useState, useEffect } from "react";
import AppShell from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Play, Edit, Download } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import PersonaEditor from "@/components/PersonaEditor";
import { supabase } from "@/integrations/supabase/client";

const Personas = () => {
  const [personas, setPersonas] = useState<any[]>([]);
  const [editorOpen, setEditorOpen] = useState(false);
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>();

  useEffect(() => {
    loadPersonas();
  }, []);

  const loadPersonas = async () => {
    const { data } = await supabase
      .from("personas")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (data) setPersonas(data);
  };

  const handleEdit = (id: string) => {
    setSelectedPersonaId(id);
    setEditorOpen(true);
  };

  const handleCreate = () => {
    setSelectedPersonaId(undefined);
    setEditorOpen(true);
  };

  const mockPersonas = [
    {
      id: 1,
      name: "Urban Saver",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
      location: "Bengaluru",
      age: 28,
      income: 600000,
      trustScore: 0.72,
      traits: ["Privacy Conscious", "Price Sensitive", "Tech Savvy"],
      lastActive: "2 hours ago",
      OCEAN: { openness: 0.6, conscientiousness: 0.8, extraversion: 0.4 }
    },
    {
      id: 2,
      name: "Green Advocate",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
      location: "Mumbai",
      age: 34,
      income: 1200000,
      trustScore: 0.85,
      traits: ["Sustainability", "Brand Loyal", "Quality Focused"],
      lastActive: "1 day ago",
      OCEAN: { openness: 0.8, conscientiousness: 0.7, extraversion: 0.6 }
    },
    {
      id: 3,
      name: "Luxury Seeker",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=3",
      location: "Delhi",
      age: 42,
      income: 2500000,
      trustScore: 0.91,
      traits: ["Premium", "Status Driven", "Experience Focused"],
      lastActive: "3 hours ago",
      OCEAN: { openness: 0.7, conscientiousness: 0.6, extraversion: 0.9 }
    },
  ];

  return (
    <AppShell>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="mb-2">Persona Library</h1>
            <p className="text-muted-foreground">Create and manage consumer personas for simulations</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Import
            </Button>
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              New Persona
            </Button>
          </div>
        </div>

        {/* Search */}
        <Card className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search personas..."
              className="pl-10"
            />
          </div>
        </Card>

        {/* Personas Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(personas.length > 0 ? personas : mockPersonas).map((persona) => {
            const oceanScores = typeof persona.ocean_scores === 'object' && persona.ocean_scores !== null
              ? persona.ocean_scores as any
              : persona.OCEAN || {};
            const traits = Array.isArray(persona.traits) ? persona.traits : persona.traits || [];

            return (
            <Card key={persona.id} className="p-6 hover:border-primary/50 transition-all group">
              <div className="flex items-start gap-4 mb-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={persona.avatar} />
                  <AvatarFallback>{persona.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <h3 className="mb-1">{persona.name}</h3>
                  <p className="text-sm text-muted-foreground">{persona.location}, {persona.age} years</p>
                  
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Trust Score:</span>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-success transition-all"
                        style={{ width: `${persona.trustScore * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium">{Math.round(persona.trustScore * 100)}%</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {(Array.isArray(traits) ? traits : []).map((trait, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {typeof trait === 'string' ? trait : String(trait)}
                    </Badge>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="text-center p-2 bg-muted/50 rounded">
                    <p className="text-muted-foreground mb-1">Openness</p>
                    <p className="font-semibold">{Math.round((oceanScores.openness || 0) * 100)}%</p>
                  </div>
                  <div className="text-center p-2 bg-muted/50 rounded">
                    <p className="text-muted-foreground mb-1">Conscientiousness</p>
                    <p className="font-semibold">{Math.round((oceanScores.conscientiousness || 0) * 100)}%</p>
                  </div>
                  <div className="text-center p-2 bg-muted/50 rounded">
                    <p className="text-muted-foreground mb-1">Extraversion</p>
                    <p className="font-semibold">{Math.round((oceanScores.extraversion || 0) * 100)}%</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-border flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">Active {persona.lastActive}</p>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <Play className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(persona.id)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
        </div>

        <PersonaEditor
          open={editorOpen}
          onOpenChange={setEditorOpen}
          personaId={selectedPersonaId}
          onSave={loadPersonas}
        />
      </div>
    </AppShell>
  );
};

export default Personas;
