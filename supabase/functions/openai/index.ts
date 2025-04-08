
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
    const requestData = await req.json();
    const { type } = requestData;

    switch (type) {
      case 'policy': {
        // Handle policy generation
        const { prompt, policyName, framework } = requestData;
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
      
      case 'assistant': {
        // Handle assistant chat
        const { messages } = requestData;
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

      case 'next_steps': {
        // Generate next steps based on completion percentage
        const { completionPercentage, framework } = requestData;
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
                content: `You are an expert compliance advisor on ${framework.toUpperCase()}. Provide concise, actionable next steps for users based on their current compliance progress.` 
              },
              { 
                role: 'user', 
                content: `Based on my current ${framework.toUpperCase()} compliance progress of ${completionPercentage}%, what are the 3 most important next steps I should take? Provide brief, practical advice.`
              }
            ],
            temperature: 0.7,
            max_tokens: 300,
          }),
        });
        
        const data = await response.json();
        return new Response(JSON.stringify({ 
          text: data.choices?.[0]?.message?.content || "Unable to generate next steps recommendation."
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'risk_assessment': {
        // Generate risk assessment based on company data
        const { companyData, framework } = requestData;
        const { industry, size, systems, vendors } = companyData;
        
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
                content: `You are a risk assessment expert for ${framework.toUpperCase()} compliance. Generate a structured risk assessment based on the provided company information. Format your response as JSON that can be parsed.` 
              },
              { 
                role: 'user', 
                content: `Generate a risk assessment for a ${size} company in the ${industry} industry.
                They use the following systems: ${systems.join(', ')}. 
                They work with these vendors: ${vendors.join(', ')}.
                Format your response as a JSON array with objects that have fields for 'riskArea', 'description', 'impact' (low/medium/high), and 'mitigationSuggestion'.`
              }
            ],
            temperature: 0.7,
            max_tokens: 1000,
          }),
        });
        
        const data = await response.json();
        let riskProfile = [];
        
        try {
          const content = data.choices?.[0]?.message?.content || "";
          // Extract JSON from the text response
          const jsonMatch = content.match(/\[\s*\{.*\}\s*\]/s);
          if (jsonMatch) {
            riskProfile = JSON.parse(jsonMatch[0]);
          }
        } catch (error) {
          console.error('Error parsing risk profile JSON:', error);
        }
        
        return new Response(JSON.stringify({ 
          riskProfile
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'recommend_tasks': {
        // Generate recommended tasks based on framework, industry, and audit stage
        const { framework, industry, auditStage } = requestData;
        
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
                content: `You are an expert compliance advisor on ${framework.toUpperCase()}. Generate recommended tasks for companies based on their industry and audit preparation stage.` 
              },
              { 
                role: 'user', 
                content: `Generate a list of 10 important compliance tasks for a company in the ${industry} industry that is in the "${auditStage}" stage of their ${framework.toUpperCase()} audit preparation process.
                Format your response as a JSON array with objects that have fields for 'title', 'description', 'priority' (high/medium/low), and 'category' (e.g., Documentation, Technical Controls, Risk Assessment).`
              }
            ],
            temperature: 0.7,
            max_tokens: 1000,
          }),
        });
        
        const data = await response.json();
        let tasks = [];
        
        try {
          const content = data.choices?.[0]?.message?.content || "";
          // Extract JSON from the text response
          const jsonMatch = content.match(/\[\s*\{.*\}\s*\]/s);
          if (jsonMatch) {
            tasks = JSON.parse(jsonMatch[0]);
          }
        } catch (error) {
          console.error('Error parsing recommended tasks JSON:', error);
        }
        
        return new Response(JSON.stringify({ 
          tasks
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      default:
        return new Response(JSON.stringify({ error: 'Invalid request type' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
  } catch (error) {
    console.error('Error in OpenAI function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
