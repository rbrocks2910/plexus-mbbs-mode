/**
 * @file aiProvider.ts
 * @description This file provides an abstraction layer for multiple AI providers.
 * Groq is the primary provider, with OpenRouter as a fallback, then Gemini as a final fallback.
 */

import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import OpenAI from "openai";

export interface GenerateContentConfig {
    model?: string; // Optional - provider uses its configured model if not specified
    contents: string;
    config?: {
        responseMimeType?: string;
        responseSchema?: any;
        temperature?: number;
        seed?: number;
    };
}

export interface AIProviderResponse {
    text: string;
    provider: 'groq' | 'openrouter' | 'gemini';
}

export interface AIProvider {
    generateContent(config: GenerateContentConfig): Promise<AIProviderResponse>;
}

/**
 * Formats a JSON schema into a human-readable description for the prompt
 */
const formatSchemaForPrompt = (schema: any): string => {
    if (!schema || typeof schema !== 'object') {
        return JSON.stringify(schema);
    }

    let description = '';

    if (schema.type) {
        description += `Type: ${schema.type}\n`;
    }

    if (schema.properties) {
        description += '\nProperties:\n';
        for (const [key, value] of Object.entries(schema.properties)) {
            const prop = value as any;
            const required = schema.required?.includes(key) ? ' (required)' : '';
            const enumValues = prop.enum ? ` - must be one of: ${prop.enum.join(', ')}` : '';
            const propDesc = prop.description ? ` - ${prop.description}` : '';
            description += `  - ${key}: ${prop.type || 'any'}${required}${enumValues}${propDesc}\n`;
        }
    }

    if (schema.required && Array.isArray(schema.required)) {
        description += `\nRequired fields: ${schema.required.join(', ')}\n`;
    }

    return description || JSON.stringify(schema, null, 2);
};

/**
 * OpenRouter provider implementation
 * Uses OpenAI-compatible API via OpenRouter
 */
export class OpenRouterProvider implements AIProvider {
    private client: OpenAI;
    private model: string;

    constructor(apiKey: string, model: string = "google/gemini-2.0-flash-exp") {
        this.client = new OpenAI({
            apiKey: apiKey,
            baseURL: "https://openrouter.ai/api/v1",
        });
        this.model = model;
    }

    async generateContent(config: GenerateContentConfig): Promise<AIProviderResponse> {
        const { contents, config: genConfig } = config;
        
        // Convert Gemini-style schema to OpenRouter format
        // Use any[] to avoid type issues with OpenAI SDK message types
        const messages: Array<{ role: "user" | "system" | "assistant"; content: string }> = [
            {
                role: "user",
                content: contents
            }
        ];

        // Add schema instructions to system message if JSON schema is required
        if (genConfig?.responseSchema && genConfig?.responseMimeType === "application/json") {
            const schemaDescription = formatSchemaForPrompt(genConfig.responseSchema);
            const systemMessage = `You must respond with valid JSON that matches this exact schema structure:\n\n${schemaDescription}\n\nReturn only the JSON object, no additional text, explanations, or markdown formatting.`;
            messages.unshift({
                role: "system",
                content: systemMessage
            });
        }

        const requestConfig: any = {
            model: this.model,
            messages: messages as any, // Cast to any to work with OpenAI SDK
        };

        // Handle JSON response format
        if (genConfig?.responseMimeType === "application/json") {
            requestConfig.response_format = { type: "json_object" };
        }

        // Handle temperature and other parameters
        if (genConfig?.temperature !== undefined) {
            requestConfig.temperature = genConfig.temperature;
        }

        const response = await this.client.chat.completions.create(requestConfig);
        
        const text = response.choices[0]?.message?.content || "";
        
        return {
            text: text.trim(),
            provider: 'openrouter'
        };
    }
}

/**
 * Groq provider implementation
 * Uses OpenAI-compatible API via Groq
 */
export class GroqProvider implements AIProvider {
    private client: OpenAI;
    private model: string;

    constructor(apiKey: string, model: string = "openai/gpt-oss-120b") {
        this.client = new OpenAI({
            apiKey: apiKey,
            baseURL: "https://api.groq.com/openai/v1",
        });
        this.model = model;
    }

    async generateContent(config: GenerateContentConfig): Promise<AIProviderResponse> {
        const { contents, config: genConfig } = config;

        const messages: Array<{ role: "user" | "system" | "assistant"; content: string }> = [
            {
                role: "user",
                content: contents
            }
        ];

        if (genConfig?.responseSchema && genConfig?.responseMimeType === "application/json") {
            const schemaDescription = formatSchemaForPrompt(genConfig.responseSchema);
            const systemMessage = `You must respond with valid JSON that matches this exact schema structure:\n\n${schemaDescription}\n\nReturn only the JSON object, no additional text, explanations, or markdown formatting.`;
            messages.unshift({
                role: "system",
                content: systemMessage
            });
        }

        const requestConfig: any = {
            model: this.model,
            messages: messages as any,
        };

        if (genConfig?.responseMimeType === "application/json") {
            requestConfig.response_format = { type: "json_object" };
        }

        if (genConfig?.temperature !== undefined) {
            requestConfig.temperature = genConfig.temperature;
        }

        const response = await this.client.chat.completions.create(requestConfig);

        const text = response.choices[0]?.message?.content || "";

        return {
            text: text.trim(),
            provider: 'groq'
        };
    }
}

/**
 * Gemini provider implementation
 * Wraps the existing GoogleGenAI client
 */
export class GeminiProvider implements AIProvider {
    private client: GoogleGenAI;
    private model: string;

    constructor(apiKey: string, model: string = "gemini-2.5-flash") {
        this.client = new GoogleGenAI({ apiKey });
        this.model = model;
    }

    async generateContent(config: GenerateContentConfig): Promise<AIProviderResponse> {
        const { contents, config: genConfig } = config;
        
        const response: GenerateContentResponse = await this.client.models.generateContent({
            model: this.model,
            contents: contents,
            config: genConfig
        });

        return {
            text: response.text || '',
            provider: 'gemini'
        };
    }
}

/**
 * Creates an AI provider with primary/fallback logic
 * Tries Groq first, falls back to OpenRouter, then Gemini on failure
 */
export function createAIProvider(): AIProvider {
    return {
        async generateContent(config: GenerateContentConfig): Promise<AIProviderResponse> {
            const groqKey = process.env.GROQ_API_KEY;
            const openRouterKey = process.env.OPENROUTER_API_KEY;
            const geminiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
            const groqModel = process.env.GROQ_MODEL || "openai/gpt-oss-120b";
            const openRouterModel = process.env.OPENROUTER_MODEL || "anthropic/claude-3.5-sonnet";
            const geminiModel = process.env.GEMINI_MODEL || "gemini-2.5-flash";

            if (!groqKey && !openRouterKey && !geminiKey) {
                throw new Error("No API key found. Please set GEMINI_API_KEY, GROQ_API_KEY, or OPENROUTER_API_KEY in your .env file.");
            }

            const groqProvider = groqKey ? new GroqProvider(groqKey, groqModel) : null;
            const openRouterProvider = openRouterKey ? new OpenRouterProvider(openRouterKey, openRouterModel) : null;
            const geminiProvider = geminiKey ? new GeminiProvider(geminiKey, geminiModel) : null;

            // Try Groq first if available
            if (groqProvider) {
                try {
                    return await groqProvider.generateContent(config);
                } catch (error) {
                    console.warn("Groq request failed, falling back to OpenRouter/Gemini:", error instanceof Error ? error.message : String(error));
                }
            }

            // Try OpenRouter next if available
            if (openRouterProvider) {
                try {
                    return await openRouterProvider.generateContent(config);
                } catch (error) {
                    console.warn("OpenRouter request failed, falling back to Gemini:", error instanceof Error ? error.message : String(error));
                }
            }

            // Fallback to Gemini
            if (geminiProvider) {
                return await geminiProvider.generateContent(config);
            }

            throw new Error("Configured AI providers failed to generate content.");
        }
    };
}

