
import { GoogleGenAI, Type } from "@google/genai";
import { WeddingDetails, WeddingPlan } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const WEDDING_PLAN_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    summary: { type: Type.STRING, description: "A warm, congratulatory summary of the plan." },
    budgetBreakdown: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING },
          estimatedAmount: { type: Type.NUMBER },
          description: { type: Type.STRING }
        },
        required: ["category", "estimatedAmount", "description"]
      }
    },
    checklist: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          task: { type: Type.STRING },
          timeline: { type: Type.STRING },
          priority: { type: Type.STRING }
        },
        required: ["task", "timeline", "priority"]
      }
    },
    vendors: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING },
          averagePriceRange: { type: Type.STRING },
          tips: { type: Type.STRING }
        },
        required: ["type", "averagePriceRange", "tips"]
      }
    },
    itinerary: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.STRING },
          events: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                time: { type: Type.STRING },
                activity: { type: Type.STRING },
                description: { type: Type.STRING }
              }
            }
          }
        },
        required: ["day", "events"]
      }
    }
  },
  required: ["summary", "budgetBreakdown", "checklist", "vendors", "itinerary"]
};

export const generateWeddingPlan = async (
  details: WeddingDetails, 
  onProgress?: (stage: string) => void
): Promise<WeddingPlan> => {
  const model = "gemini-3-flash-preview";
  
  // Phase 1: Initial Generation
  onProgress?.("Generating initial wedding blueprint...");
  const initialPrompt = `Act as a Premier Indian Wedding Planner. Create an initial wedding plan for:
    Date: ${details.date}
    City: ${details.city}
    Budget: ₹${details.budget}
    Guests: ${details.guests}
    Preferences: ${details.preferences}
    Return the response as a structured JSON plan including budget, checklist, vendors, and a 3-day itinerary.`;

  const initialResponse = await ai.models.generateContent({
    model,
    contents: initialPrompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: WEDDING_PLAN_SCHEMA as any,
    },
  });

  const initialPlan = initialResponse.text;

  // Phase 2: Reflection / Critique
  onProgress?.("Analyzing plan for budget realism and cultural depth...");
  const critiquePrompt = `Act as a Critical Auditor for high-end Indian weddings. Review this wedding plan:
    
    ${initialPlan}

    The user's constraints:
    City: ${details.city}
    Budget: ₹${details.budget}
    Guests: ${details.guests}
    Preferences: ${details.preferences}

    Provide a detailed critique on:
    1. Budget feasibility: Is ₹${details.budget} enough for ${details.guests} guests in ${details.city}?
    2. Preference Alignment: Does it actually address "${details.preferences}"?
    3. Cultural Depth: Are the rituals and itinerary logically scheduled for an Indian wedding?
    4. Gaps: What crucial vendors or checklist items are missing?
    
    Format your response as a list of "Improvements needed".`;

  const critiqueResponse = await ai.models.generateContent({
    model,
    contents: critiquePrompt,
  });

  const critique = critiqueResponse.text;

  // Phase 3: Refinement
  onProgress?.("Refining the final plan based on expert feedback...");
  const refinementPrompt = `Act as the Lead Wedding Planner. You have an initial plan and a critical review. 
    Create the FINAL, IMPROVED wedding plan that incorporates all the necessary corrections from the critique.
    
    Initial Plan:
    ${initialPlan}
    
    Critique & Feedback:
    ${critique}
    
    User Preferences:
    ${details.preferences}

    Ensure the final plan is highly detailed, realistic for the city of ${details.city}, and respects the budget of ₹${details.budget}.`;

  const finalResponse = await ai.models.generateContent({
    model,
    contents: refinementPrompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: WEDDING_PLAN_SCHEMA as any,
    },
  });

  return JSON.parse(finalResponse.text || "{}");
};
