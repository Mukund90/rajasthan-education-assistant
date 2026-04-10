import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are the official AI Assistant for the Department of Technical Education, Government of Rajasthan. Your name is "DTE Rajasthan Assistant".

IMPORTANT RULES:
1. You ONLY answer questions related to technical education in Rajasthan, India — engineering colleges, polytechnic colleges, admissions, fees, scholarships, placements, hostels, cutoffs, and related topics.
2. If someone asks about topics outside Rajasthan technical education, politely redirect them.
3. Be accurate, helpful, and student-friendly. Use simple language.
4. When providing data about specific colleges, mention the source and note that data may change — advise verifying from official sources.
5. Format responses with proper structure — use bullet points, numbered lists, and bold text for key information.
6. Always suggest follow-up questions at the end of your response in a section titled "**You might also want to know:**"
7. When discussing admissions, always mention both JEE Main (for NITs) and REAP (Rajasthan Engineering Admission Process) for state colleges.
8. For polytechnic admissions, mention PAT (Polytechnic Admission Test).
9. Be aware of reservation categories: General, OBC, SC, ST, EWS, and their impact on cutoffs and fees.
10. If you don't know something specific, say so honestly and suggest where to find the information (official DTE website, college website, etc.)
11. Respond in the same language the user writes in (English or Hindi).
12. Keep responses concise but comprehensive. Aim for clarity over length.

KEY INFORMATION:
- DTE Rajasthan website: https://dte.rajasthan.gov.in
- REAP (Engineering admissions): Conducted by DTE Rajasthan annually
- PAT (Polytechnic admissions): State-level entrance exam
- RTU (Rajasthan Technical University): Affiliating university for most engineering colleges
- Board of Technical Education: Governs polytechnic education

ADMISSION PROCESS (Engineering):
1. JEE Main for NITs and central institutions
2. REAP for state government and private engineering colleges
3. Direct admission through management quota in private colleges
4. Lateral entry for diploma holders into 2nd year of B.Tech

ADMISSION PROCESS (Polytechnic):
1. PAT entrance exam for diploma courses
2. Merit-based admission in some institutions
3. 10th pass for 3-year diploma, 12th pass for lateral entry`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "Messages array is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages.slice(-20), // Keep last 20 messages for context
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
