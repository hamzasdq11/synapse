import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PersonaEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  personaId?: string;
  onSave?: () => void;
}

const PersonaEditor = ({ open, onOpenChange, personaId, onSave }: PersonaEditorProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    age: 30,
    income: 500000,
    trust_score: 0.5,
    price_sensitivity: 0.5,
    privacy_threshold: 0.5,
    ocean_scores: {
      openness: 0.5,
      conscientiousness: 0.5,
      extraversion: 0.5,
      agreeableness: 0.5,
      neuroticism: 0.5,
    },
  });

  useEffect(() => {
    if (personaId) {
      loadPersona();
    } else {
      resetForm();
    }
  }, [personaId, open]);

  const resetForm = () => {
    setFormData({
      name: "",
      location: "",
      age: 30,
      income: 500000,
      trust_score: 0.5,
      price_sensitivity: 0.5,
      privacy_threshold: 0.5,
      ocean_scores: {
        openness: 0.5,
        conscientiousness: 0.5,
        extraversion: 0.5,
        agreeableness: 0.5,
        neuroticism: 0.5,
      },
    });
  };

  const loadPersona = async () => {
    if (!personaId) return;
    
    const { data, error } = await supabase
      .from("personas")
      .select("*")
      .eq("id", personaId)
      .single();

    if (error) {
      toast.error("Failed to load persona");
      return;
    }

    if (data) {
      const oceanScores = typeof data.ocean_scores === 'object' && data.ocean_scores !== null
        ? data.ocean_scores as any
        : {
            openness: 0.5,
            conscientiousness: 0.5,
            extraversion: 0.5,
            agreeableness: 0.5,
            neuroticism: 0.5,
          };

      setFormData({
        name: data.name,
        location: data.location || "",
        age: data.age || 30,
        income: Number(data.income) || 500000,
        trust_score: Number(data.trust_score) || 0.5,
        price_sensitivity: Number(data.price_sensitivity) || 0.5,
        privacy_threshold: Number(data.privacy_threshold) || 0.5,
        ocean_scores: {
          openness: Number(oceanScores.openness) || 0.5,
          conscientiousness: Number(oceanScores.conscientiousness) || 0.5,
          extraversion: Number(oceanScores.extraversion) || 0.5,
          agreeableness: Number(oceanScores.agreeableness) || 0.5,
          neuroticism: Number(oceanScores.neuroticism) || 0.5,
        },
      });
    }
  };

  const handleSave = async () => {
    setLoading(true);

    try {
      // Use constant anonymous user ID since there's no authentication
      const ANONYMOUS_USER_ID = "00000000-0000-0000-0000-000000000000";

      if (personaId) {
        const { error } = await supabase
          .from("personas")
          .update({
            ...formData,
            ocean_scores: formData.ocean_scores,
          })
          .eq("id", personaId);

        if (error) throw error;
        toast.success("Persona updated!");
      } else {
        const { error } = await supabase
          .from("personas")
          .insert({
            ...formData,
            user_id: ANONYMOUS_USER_ID,
            ocean_scores: formData.ocean_scores,
          });

        if (error) throw error;
        toast.success("Persona created!");
      }

      onOpenChange(false);
      onSave?.();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{personaId ? "Edit" : "Create"} Persona</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Urban Saver"
              />
            </div>
            <div>
              <Label>Location</Label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Bengaluru"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Age</Label>
              <Input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <Label>Annual Income (₹)</Label>
              <Input
                type="number"
                value={formData.income}
                onChange={(e) => setFormData({ ...formData, income: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div>
            <Label>Trust Score: {(formData.trust_score * 100).toFixed(0)}%</Label>
            <Slider
              value={[formData.trust_score * 100]}
              onValueChange={(v) => setFormData({ ...formData, trust_score: v[0] / 100 })}
              max={100}
              step={1}
              className="mt-2"
            />
          </div>

          <div>
            <Label>Price Sensitivity: {(formData.price_sensitivity * 100).toFixed(0)}%</Label>
            <Slider
              value={[formData.price_sensitivity * 100]}
              onValueChange={(v) => setFormData({ ...formData, price_sensitivity: v[0] / 100 })}
              max={100}
              step={1}
              className="mt-2"
            />
          </div>

          <div>
            <Label>Privacy Threshold: {(formData.privacy_threshold * 100).toFixed(0)}%</Label>
            <Slider
              value={[formData.privacy_threshold * 100]}
              onValueChange={(v) => setFormData({ ...formData, privacy_threshold: v[0] / 100 })}
              max={100}
              step={1}
              className="mt-2"
            />
          </div>

          <div className="border-t pt-4">
            <h4 className="font-semibold mb-4">OCEAN Personality Scores</h4>
            
            <div className="space-y-4">
              <div>
                <Label>Openness: {(formData.ocean_scores.openness * 100).toFixed(0)}%</Label>
                <Slider
                  value={[formData.ocean_scores.openness * 100]}
                  onValueChange={(v) => setFormData({
                    ...formData,
                    ocean_scores: { ...formData.ocean_scores, openness: v[0] / 100 }
                  })}
                  max={100}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Conscientiousness: {(formData.ocean_scores.conscientiousness * 100).toFixed(0)}%</Label>
                <Slider
                  value={[formData.ocean_scores.conscientiousness * 100]}
                  onValueChange={(v) => setFormData({
                    ...formData,
                    ocean_scores: { ...formData.ocean_scores, conscientiousness: v[0] / 100 }
                  })}
                  max={100}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Extraversion: {(formData.ocean_scores.extraversion * 100).toFixed(0)}%</Label>
                <Slider
                  value={[formData.ocean_scores.extraversion * 100]}
                  onValueChange={(v) => setFormData({
                    ...formData,
                    ocean_scores: { ...formData.ocean_scores, extraversion: v[0] / 100 }
                  })}
                  max={100}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Agreeableness: {(formData.ocean_scores.agreeableness * 100).toFixed(0)}%</Label>
                <Slider
                  value={[formData.ocean_scores.agreeableness * 100]}
                  onValueChange={(v) => setFormData({
                    ...formData,
                    ocean_scores: { ...formData.ocean_scores, agreeableness: v[0] / 100 }
                  })}
                  max={100}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Neuroticism: {(formData.ocean_scores.neuroticism * 100).toFixed(0)}%</Label>
                <Slider
                  value={[formData.ocean_scores.neuroticism * 100]}
                  onValueChange={(v) => setFormData({
                    ...formData,
                    ocean_scores: { ...formData.ocean_scores, neuroticism: v[0] / 100 }
                  })}
                  max={100}
                  step={1}
                  className="mt-2"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? "Saving..." : "Save Persona"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PersonaEditor;
