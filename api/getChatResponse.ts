import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ai } from './_lib/ai.js';
import { getChatPrompt, getFMTChatPrompt } from './_lib/prompts.js';
import { ChatMessage, PatientProfile, MedicalCase } from './_lib/types.js';
import { verifyAuth, AuthResult } from './_lib/auth.js';
import { rateLimit } from './_lib/rateLimit.js';
import { FirebaseAdminService } from './_lib/firebaseAdminService.js';
import {
  validateTextField,
  validateArray,
  ValidationResult
} from './_lib/validation.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Only POST requests allowed' });
    }

    // Apply rate limiting - limit to 30 requests per 5 minutes per authenticated user for chat responses
    const rateLimitResult = await rateLimit(req, 5 * 60 * 1000, 30); // 30 requests per 5 minutes
    if (!rateLimitResult.allowed) {
        const retryAfterSeconds = Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000);
        res.setHeader('Retry-After', retryAfterSeconds.toString());
        return res.status(429).json({
            error: 'Rate limit exceeded',
            message: `Too many requests. Please try again in ${retryAfterSeconds} seconds.`
        });
    }

    // Verify authentication
    const authResult: AuthResult = await verifyAuth(req);
    if (!authResult.authenticated) {
        return res.status(401).json({
            error: 'Unauthorized: Invalid or missing authentication token'
        });
    }

    try {
        const body = req.body;
        if (typeof body !== 'object' || body === null || !Array.isArray(body.chatHistory) || !body.patient || typeof body.diagnosis !== 'string') {
            console.error(`[Request Body Error] getChatResponse - User: ${authResult.uid?.substring(0, 8)}..., Invalid body structure:`, {
                bodyType: typeof body,
                hasBody: body !== null,
                hasChatHistory: Array.isArray(body?.chatHistory),
                hasPatient: !!body?.patient,
                hasDiagnosis: typeof body?.diagnosis === 'string'
            });
            return res.status(400).json({ error: 'Invalid request body. "chatHistory", "patient", and "diagnosis" are required.' });
        }

        // Detailed validation of input parameters
        const diagnosisValidation = validateTextField(body.diagnosis, 500);
        const chatHistoryValidation = validateArray(
          body.chatHistory,
          (message: ChatMessage) => validateTextField(message.text, 2000),
          50
        );

        // Validate patient profile fields
        const patientNameValidation = body.patient.name ? validateTextField(body.patient.name, 100) : { isValid: true, errors: [] } as ValidationResult;
        const patientAgeValidation = body.patient.age ? validateTextField(body.patient.age.toString(), 3) : { isValid: true, errors: [] } as ValidationResult;

        // Combine validation results
        const validationErrors: string[] = [];

        if (!diagnosisValidation.isValid) {
          validationErrors.push(...diagnosisValidation.errors);
        }

        if (!chatHistoryValidation.isValid) {
          validationErrors.push(...chatHistoryValidation.errors);
        }

        if (!patientNameValidation.isValid) {
          validationErrors.push(...patientNameValidation.errors);
        }

        if (!patientAgeValidation.isValid) {
          validationErrors.push(...patientAgeValidation.errors);
        }

        if (validationErrors.length > 0) {
          console.error(`[Validation Error] getChatResponse - User: ${authResult.uid?.substring(0, 8)}..., Errors:`, validationErrors);
          return res.status(400).json({
            error: 'Validation failed',
            details: validationErrors
          });
        }

        const { chatHistory, patient, diagnosis, fmtMode, medicineMode } = body as { 
            chatHistory: ChatMessage[], 
            patient: PatientProfile, 
            diagnosis: string,
            fmtMode?: { enabled: boolean; zone: 1 | 2 | 3; topicId: string; topicName: string },
            medicineMode?: { prescriptions: any[] }
        };

        // Use FMT-specific prompt if in FMT mode, otherwise use normal patient prompt
        const prompt = (fmtMode?.enabled && fmtMode.zone)
            ? getFMTChatPrompt(chatHistory, patient, diagnosis, fmtMode.zone)
            : getChatPrompt(chatHistory, patient, diagnosis, medicineMode?.prescriptions, body.causativeAgent);

        const response = await ai.generateContent({
            contents: prompt
        });

        console.log(`[AI Chat Response] Provider: ${response.provider}, Diagnosis: ${diagnosis.substring(0, 50)}...`);

        const rawText = response.text;
        let result: { 
            text: string; 
            emotionalState: string; 
            physicalReaction?: string; 
            observations?: string;
        };

        try {
            const jsonPart = rawText.match(/\{[\s\S]*\}/);
            if (jsonPart) {
                result = JSON.parse(jsonPart[0]);
            } else {
                throw new Error("No JSON found");
            }
        } catch (e) {
            console.warn("Retrying old format parsing for chat response");
            const match = rawText.match(/^\[(.*?)\]\s*(.*)/s);
            if (match) {
                result = { emotionalState: match[1], text: match[2].trim() };
            } else {
                result = { text: rawText.trim(), emotionalState: patient.initialEmotionalState };
            }
        }

        // Update API usage statistics after successful processing, but do it carefully to not affect the response
        if (authResult.uid) {
            try {
                await FirebaseAdminService.incrementApiUsage(authResult.uid);
            } catch (usageError) {
                console.error('Error updating API usage stats (non-fatal):', usageError);
                // Important: Don't let usage tracking errors affect the main API response
            }
        }

        res.status(200).json(result);

    } catch (error) {
        console.error(`[API Error] getChatResponse - User: ${authResult.uid?.substring(0, 8)}...`, error);
        console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        res.status(500).json({ text: `Server error: ${errorMessage}`, emotionalState: "Confused" });
    }
}