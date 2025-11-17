import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { campaignId, personaId } = await req.json();
    const authHeader = req.headers.get('Authorization')!;
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_PUBLISHABLE_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    // Get user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Get campaign and persona
    const { data: campaign } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', campaignId)
      .single();

    const { data: persona } = await supabase
      .from('personas')
      .select('*')
      .eq('id', personaId)
      .single();

    if (!campaign || !persona) {
      throw new Error('Campaign or persona not found');
    }

    // Call OpenAI to simulate negotiation
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are simulating a negotiation between a brand and a consumer persona. 
            
Consumer Persona:
- Name: ${persona.name}
- Age: ${persona.age}, Location: ${persona.location}
- Income: ₹${persona.income}
- Trust Score: ${(persona.trust_score * 100).toFixed(0)}%
- Price Sensitivity: ${(persona.price_sensitivity * 100).toFixed(0)}%
- Privacy Threshold: ${(persona.privacy_threshold * 100).toFixed(0)}%

Campaign Offer:
- Product: ${campaign.product_name}
- Price: ₹${campaign.price}
- Description: ${campaign.description || 'Premium product'}

Simulate a realistic negotiation. The consumer should respond based on their personality traits and sensitivities. Generate 3-5 message exchanges, ending with either acceptance, rejection, or a counter-offer. Format as JSON array of messages with: {"actor": "brand"|"consumer", "text": "message", "sentiment": number between -1 and 1}.`
          },
          {
            role: 'user',
            content: 'Start the negotiation simulation.'
          }
        ],
        temperature: 0.8,
      }),
    });

    if (!openaiResponse.ok) {
      const error = await openaiResponse.text();
      console.error('OpenAI error:', error);
      throw new Error('OpenAI API failed');
    }

    const aiData = await openaiResponse.json();
    const simulationText = aiData.choices[0].message.content;
    
    // Parse the AI response to extract transcript
    let transcript: any[] = [];
    let outcome = 'rejected';
    
    try {
      transcript = JSON.parse(simulationText);
      
      // Determine outcome from last message
      const lastMessage = transcript[transcript.length - 1];
      if (lastMessage.text.toLowerCase().includes('accept')) {
        outcome = 'accepted';
      } else if (lastMessage.text.toLowerCase().includes('counter')) {
        outcome = 'counter';
      }
    } catch {
      // Fallback if parsing fails
      transcript = [
        { actor: 'brand', text: `Offering ${campaign.product_name} for ₹${campaign.price}`, sentiment: 0.5 },
        { actor: 'consumer', text: simulationText.substring(0, 200), sentiment: -0.2 },
      ];
    }

    // Calculate metrics
    const acceptanceRate = outcome === 'accepted' ? 1 : outcome === 'counter' ? 0.5 : 0;

    // Create simulation record
    const { data: simulation, error: simError } = await supabase
      .from('simulations')
      .insert({
        user_id: user.id,
        campaign_id: campaignId,
        persona_id: personaId,
        status: 'completed',
        outcome,
        transcript,
        metrics: {
          acceptanceRate,
          sentimentAvg: transcript.reduce((acc, m) => acc + (m.sentiment || 0), 0) / transcript.length,
        },
      })
      .select()
      .single();

    if (simError) throw simError;

    // Update campaign acceptance rate
    const { data: allSims } = await supabase
      .from('simulations')
      .select('outcome')
      .eq('campaign_id', campaignId);

    if (allSims) {
      const accepted = allSims.filter(s => s.outcome === 'accepted').length;
      const total = allSims.length;
      const newRate = total > 0 ? accepted / total : 0;

      await supabase
        .from('campaigns')
        .update({ acceptance_rate: newRate })
        .eq('id', campaignId);
    }

    return new Response(JSON.stringify({ simulation }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
