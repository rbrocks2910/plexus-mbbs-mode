import { ai } from './_lib/ai.js';

export default async function handler(req: any, res: any) {
  try {
    // Test the AI provider with a simple prompt
    const response = await ai.generateContent({
      contents: "Say 'Hello, world!' in JSON format: {\"message\": \"your response\"}"
    });

    res.status(200).json({
      success: true,
      provider: response.provider,
      response: response.text
    });
  } catch (error) {
    console.error("Error in testGoogleApi:", error);
    res.status(500).json({ 
      error: "Internal server error",
      message: error instanceof Error ? error.message : String(error)
    });
  }
}