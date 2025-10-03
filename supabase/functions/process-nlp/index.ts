import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, datasetId } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const authHeader = req.headers.get('Authorization');

    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");
    if (!text) throw new Error("No text provided");
    if (!datasetId) throw new Error("No dataset ID provided");

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from auth header
    const token = authHeader?.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) throw new Error("Unauthorized");

    console.log("Processing NLP for user:", user.id, "dataset:", datasetId);

    // Step 1: Named Entity Recognition (NER)
    const nerResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: "You are an expert NLP system. Extract named entities from text and classify them."
          },
          {
            role: "user",
            content: `Extract all named entities from the following text and classify them as PERSON, ORGANIZATION, LOCATION, DATE, or OTHER. Return as JSON array with format: [{"text": "entity", "label": "TYPE", "confidence": 0.95}]\n\nText: ${text}`
          }
        ],
        tools: [{
          type: "function",
          function: {
            name: "extract_entities",
            description: "Extract named entities from text",
            parameters: {
              type: "object",
              properties: {
                entities: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      text: { type: "string" },
                      label: { type: "string", enum: ["PERSON", "ORGANIZATION", "LOCATION", "DATE", "OTHER"] },
                      confidence: { type: "number", minimum: 0, maximum: 1 }
                    },
                    required: ["text", "label", "confidence"],
                    additionalProperties: false
                  }
                }
              },
              required: ["entities"],
              additionalProperties: false
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "extract_entities" } }
      }),
    });

    if (!nerResponse.ok) {
      const errorText = await nerResponse.text();
      console.error("NER API error:", nerResponse.status, errorText);
      throw new Error("NER processing failed");
    }

    const nerData = await nerResponse.json();
    const entitiesData = JSON.parse(nerData.choices[0].message.tool_calls[0].function.arguments);
    const entities: Array<{ text: string; label: string; confidence: number }> = entitiesData.entities || [];

    console.log("Extracted entities:", entities.length);

    // Store entities in database
    const storedEntities = [];
    for (const entity of entities) {
      const { data: entityData, error: entityError } = await supabase
        .from('entities')
        .insert({
          dataset_id: datasetId,
          user_id: user.id,
          text: entity.text,
          label: entity.label,
          confidence: entity.confidence
        })
        .select()
        .single();

      if (!entityError && entityData) {
        storedEntities.push(entityData);
      }
    }

    // Step 2: Relation Extraction
    const relationResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: "You are an expert at extracting relationships between entities in text."
          },
          {
            role: "user",
            content: `Given these entities: ${JSON.stringify(entities.map(e => e.text))}\n\nExtract relationships from the text: "${text}"\n\nReturn as JSON array with format: [{"subject": "entity1", "predicate": "relationship", "object": "entity2", "confidence": 0.9}]`
          }
        ],
        tools: [{
          type: "function",
          function: {
            name: "extract_relations",
            description: "Extract relationships between entities",
            parameters: {
              type: "object",
              properties: {
                relations: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      subject: { type: "string" },
                      predicate: { type: "string" },
                      object: { type: "string" },
                      confidence: { type: "number", minimum: 0, maximum: 1 }
                    },
                    required: ["subject", "predicate", "object", "confidence"],
                    additionalProperties: false
                  }
                }
              },
              required: ["relations"],
              additionalProperties: false
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "extract_relations" } }
      }),
    });

    if (!relationResponse.ok) {
      const errorText = await relationResponse.text();
      console.error("Relation extraction API error:", relationResponse.status, errorText);
      throw new Error("Relation extraction failed");
    }

    const relationData = await relationResponse.json();
    const relationsData = JSON.parse(relationData.choices[0].message.tool_calls[0].function.arguments);
    const relations = relationsData.relations || [];

    console.log("Extracted relations:", relations.length);

    // Store knowledge triples
    for (const relation of relations) {
      await supabase
        .from('knowledge_triples')
        .insert({
          dataset_id: datasetId,
          user_id: user.id,
          subject: relation.subject,
          predicate: relation.predicate,
          object: relation.object,
          confidence: relation.confidence
        });
    }

    // Update dataset status
    await supabase
      .from('datasets')
      .update({ status: 'completed' })
      .eq('id', datasetId);

    return new Response(
      JSON.stringify({ 
        success: true,
        entities: storedEntities,
        relations,
        message: "NLP processing completed successfully"
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Error in process-nlp function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
