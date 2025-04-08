
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, prompt, policyName, framework, messages } = await req.json();

    if (type === 'policy') {
      // Handle policy generation
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { 
              role: 'system', 
              content: `You are an expert in compliance policies. Generate professional and regulation-compliant ${framework.toUpperCase()} policy content.`
            },
            { 
              role: 'user', 
              content: `Generate a ${prompt} section for a policy titled "${policyName}" that adheres to ${framework.toUpperCase()} compliance framework requirements.`
            }
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });
      
      const data = await response.json();
      return new Response(JSON.stringify({ 
        text: data.choices?.[0]?.message?.content || "Failed to generate policy content." 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } 
    else if (type === 'assistant') {
      // Handle assistant chat
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { 
              role: 'system', 
              content: 'You are a helpful compliance assistant specialized in NIS2 and SOX frameworks. Provide concise, accurate advice to help users understand compliance requirements and best practices. Keep responses under 150 words when possible.'
            },
            ...messages
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });
      
      const data = await response.json();
      return new Response(JSON.stringify({ 
        reply: data.choices?.[0]?.message?.content || "I couldn't process your request at this moment."
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    return new Response(JSON.stringify({ error: 'Invalid request type' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in OpenAI function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
