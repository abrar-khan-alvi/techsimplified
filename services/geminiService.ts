import { GoogleGenAI, Type } from "@google/genai";
import { Language, Region, Story, StoryStatus } from "../types";

// Initialize Gemini
// Note: In a real production app, we wouldn't fetch news this way, 
// but for the MVP without a backend scraper, we ask Gemini to "simulate" the aggregator.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = "gemini-3-flash-preview";

/**
 * Simulates the "Batch Aggregation" feature.
 * In a real app, this would be a backend cron job scraping RSS feeds.
 * Here, we ask Gemini to generate realistic recent tech news metadata + summaries.
 */
export const fetchNewStoriesBatch = async (): Promise<Story[]> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Generate 4 distinct, realistic, global technology news stories that might have happened in the last 24 hours. 
      Focus on AI, Robotics, Space, or Green Tech.
      
      For each story, provide:
      1. A catchy headline.
      2. A fictional but realistic source name.
      3. A simplified summary (reading level for a 7-year-old). The summary should be 2-3 sentences.
      4. A region (Global, North America, Europe, Asia Pacific, Latin America, Africa).
      5. 2 topic tags.
      
      Return the data as a JSON array.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              sourceName: { type: Type.STRING },
              summary: { type: Type.STRING },
              region: { type: Type.STRING },
              topics: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["title", "sourceName", "summary", "region", "topics"]
          }
        }
      }
    });

    const rawData = JSON.parse(response.text || "[]");

    // Map the raw AI response to our Story application model
    const newStories: Story[] = rawData.map((item: any, index: number) => ({
      id: `gen-${Date.now()}-${index}`,
      title: item.title,
      sourceName: item.sourceName,
      sourceUrl: "https://example.com/original-article", // Placeholder
      region: mapRegionString(item.region),
      imageUrl: `https://picsum.photos/800/600?random=${Date.now() + index}`,
      publishedAt: new Date().toISOString(),
      summary: item.summary,
      translations: {},
      status: StoryStatus.PENDING, // Default to pending for admin review
      topics: item.topics,
      likes: 0
    }));

    return newStories;

  } catch (error) {
    console.error("Failed to fetch batch stories:", error);
    throw new Error("Could not aggregate new stories at this time.");
  }
};

/**
 * Translates a given text into the target language using Gemini.
 * Enforces the "simple reading level" constraint.
 */
export const translateStorySummary = async (text: string, targetLang: Language): Promise<string> => {
  try {
    const prompt = `Translate the following text into ${targetLang}. 
    CRITICAL INSTRUCTION: Keep the language very simple, suitable for a 7-year-old to understand. 
    Do not add extra explanations, just translate the meaning simply.
    
    Text: "${text}"`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        temperature: 0.3 // Low temperature for more accurate translation
      }
    });

    return response.text || "Translation unavailable.";
  } catch (error) {
    console.error(`Translation failed for ${targetLang}:`, error);
    throw new Error("Translation failed.");
  }
};

// Helper to safely map string to Enum
const mapRegionString = (str: string): Region => {
  const normalized = str.toLowerCase();
  if (normalized.includes("asia")) return Region.ASIA_PACIFIC;
  if (normalized.includes("europe")) return Region.EUROPE;
  if (normalized.includes("america") && normalized.includes("north")) return Region.NORTH_AMERICA;
  if (normalized.includes("latin") || normalized.includes("south")) return Region.LATIN_AMERICA;
  if (normalized.includes("africa")) return Region.AFRICA;
  return Region.GLOBAL;
};
