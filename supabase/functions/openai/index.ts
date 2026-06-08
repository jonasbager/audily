import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-2.5-flash";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function callAI(messages: any[], temperature = 0.7) {
  console.log("callAI: key present?", !!LOVABLE_API_KEY, "model:", MODEL);
  const res = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model: MODEL, messages, temperature }),
  });

  const raw = await res.text();
  console.log("AI gateway response", res.status, raw.slice(0, 500));

  if (!res.ok) {
    if (res.status === 429) throw new Error("Rate limit exceeded. Please try again shortly.");
    if (res.status === 402) throw new Error("AI credits exhausted. Please add credits to your workspace.");
    throw new Error(`AI gateway error ${res.status}: ${raw}`);
  }

  const data = JSON.parse(raw);
  return data.choices?.[0]?.message?.content ?? "";
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const requestData = await req.json();
    const { type } = requestData;

    switch (type) {
      case "policy": {
        const { prompt, policyName, framework } = requestData;
        const text = await callAI([
          { role: "system", content: `You are an expert in compliance policies. Generate professional and regulation-compliant ${framework.toUpperCase()} policy content.` },
          { role: "user", content: `Generate a ${prompt} section for a policy titled "${policyName}" that adheres to ${framework.toUpperCase()} compliance framework requirements.` },
        ]);
        return new Response(JSON.stringify({ text: text || "Failed to generate policy content. [v2]" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "assistant": {
        const { messages } = requestData;
        const reply = await callAI([
          { role: "system", content: "You are a helpful compliance assistant specialized in NIS2 and SOX frameworks. Provide concise, accurate advice to help users understand compliance requirements and best practices. Keep responses under 150 words when possible." },
          ...messages,
        ]);
        return new Response(JSON.stringify({ reply: reply || "I couldn't process your request at this moment." }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "next_steps": {
        const { completionPercentage, framework } = requestData;
        const text = await callAI([
          { role: "system", content: `You are an expert compliance advisor on ${framework.toUpperCase()}. Provide concise, actionable next steps for users based on their current compliance progress.` },
          { role: "user", content: `Based on my current ${framework.toUpperCase()} compliance progress of ${completionPercentage}%, what are the 3 most important next steps I should take? Provide brief, practical advice.` },
        ]);
        return new Response(JSON.stringify({ text: text || "Unable to generate next steps recommendation." }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "risk_assessment": {
        const { companyData, framework } = requestData;
        const { industry, size, systems, vendors } = companyData;
        const content = await callAI([
          { role: "system", content: `You are a risk assessment expert for ${framework.toUpperCase()} compliance. Generate a structured risk assessment based on the provided company information. Format your response as JSON that can be parsed.` },
          { role: "user", content: `Generate a risk assessment for a ${size} company in the ${industry} industry.
They use the following systems: ${(systems || []).join(", ")}.
They work with these vendors: ${(vendors || []).join(", ")}.
Format your response as a JSON array with objects that have fields for 'riskArea', 'description', 'impact' (low/medium/high), and 'mitigationSuggestion'.` },
        ]);
        let riskProfile: any[] = [];
        try {
          const jsonMatch = content.match(/\[\s*\{[\s\S]*\}\s*\]/);
          if (jsonMatch) riskProfile = JSON.parse(jsonMatch[0]);
        } catch (e) {
          console.error("Error parsing risk profile JSON:", e);
        }
        return new Response(JSON.stringify({ riskProfile }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "recommend_tasks": {
        const { framework, industry, auditStage } = requestData;
        const content = await callAI([
          { role: "system", content: `You are an expert compliance advisor on ${framework.toUpperCase()}. Generate recommended tasks for companies based on their industry and audit preparation stage.` },
          { role: "user", content: `Generate a list of 10 important compliance tasks for a company in the ${industry} industry that is in the "${auditStage}" stage of their ${framework.toUpperCase()} audit preparation process.
Format your response as a JSON array with objects that have fields for 'title', 'description', 'priority' (high/medium/low), and 'category' (e.g., Documentation, Technical Controls, Risk Assessment).` },
        ]);
        let tasks: any[] = [];
        try {
          const jsonMatch = content.match(/\[\s*\{[\s\S]*\}\s*\]/);
          if (jsonMatch) tasks = JSON.parse(jsonMatch[0]);
        } catch (e) {
          console.error("Error parsing recommended tasks JSON:", e);
        }
        return new Response(JSON.stringify({ tasks }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      default:
        return new Response(JSON.stringify({ error: "Invalid request type" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
  } catch (error: any) {
    console.error("Error in AI function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
