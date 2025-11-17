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
    const { campaignId, personaId, model = 'gpt-4o' } = await req.json();
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

    // Call AI API to simulate negotiation
    let apiResponse;
    
    if (model === 'gemini-2.5-flash') {
      // Call Google Gemini API
      apiResponse = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': Deno.env.get('GEMINI_API_KEY') || '',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are simulating a realistic, extended negotiation between a brand and a consumer persona. 
            
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

Generate a realistic, multi-turn negotiation with AT LEAST 10-15 message exchanges. The negotiation should:
1. Start with the brand's initial pitch
2. Include consumer questions about features, warranty, and price
3. Show brand responses addressing concerns
4. Include price negotiations with counter-offers
5. Discuss value propositions and benefits
6. Show the consumer's thought process
7. Include objections and how the brand handles them
8. Build to a natural conclusion (acceptance, rejection, or counter-offer)

Make it feel like a real human conversation - not rushed. The consumer should respond based on their personality traits and sensitivities. 

Format as a JSON array of messages with: {"actor": "brand"|"consumer", "text": "message", "sentiment": number between -1 and 1}.`
            }]
          }],
          generationConfig: {
            temperature: 0.8,
          }
        }),
      });
    } else {
      // Call OpenAI API
      apiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: `You are simulating a realistic, extended negotiation between a brand and a consumer persona. 
            
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

Generate a realistic, multi-turn negotiation with AT LEAST 10-15 message exchanges. The negotiation should:
1. Start with the brand's initial pitch
2. Include consumer questions about features, warranty, and price
3. Show brand responses addressing concerns
4. Include price negotiations with counter-offers
5. Discuss value propositions and benefits
6. Show the consumer's thought process
7. Include objections and how the brand handles them
8. Build to a natural conclusion (acceptance, rejection, or counter-offer)

Make it feel like a real human conversation - not rushed. The consumer should respond based on their personality traits and sensitivities. 

Format as a JSON array of messages with: {"actor": "brand"|"consumer", "text": "message", "sentiment": number between -1 and 1}.`
          },
          {
            role: 'user',
            content: 'Start the negotiation simulation.'
          }
        ],
        temperature: 0.8,
      }),
      });
    }

    if (!apiResponse.ok) {
      const error = await apiResponse.text();
      console.error('API error:', error);
      throw new Error(`${model} API failed`);
    }

    const aiData = await apiResponse.json();
    let simulationText;
    
    if (model === 'gemini-2.5-flash') {
      simulationText = aiData.candidates?.[0]?.content?.parts?.[0]?.text || '';
    } else {
      simulationText = aiData.choices[0].message.content;
    }
    
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
