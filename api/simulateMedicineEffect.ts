import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ai } from './_lib/ai.js';
import { getMedicineSimulationPrompt } from './_lib/prompts.js';
import { MedicalCase, PrescriptionItem } from './_lib/types.js';
import { verifyAuth, AuthResult } from './_lib/auth.js';
import { rateLimit } from './_lib/rateLimit.js';
import { FirebaseAdminService } from './_lib/firebaseAdminService.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Only POST requests allowed' });
    }

    // Apply rate limiting
    const rateLimitResult = await rateLimit(req, 5 * 60 * 1000, 20); // 20 requests per 5 minutes
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
        const { medicalCase, prescriptions, timeSkipValue, timeSkipUnit } = req.body as {
            medicalCase: MedicalCase;
            prescriptions: PrescriptionItem[];
            timeSkipValue: number;
            timeSkipUnit: 'minutes' | 'hours' | 'days';
        };

        if (!medicalCase || !prescriptions || !timeSkipValue || !timeSkipUnit) {
            return res.status(400).json({ error: 'Missing required fields in request body.' });
        }

        const prompt = getMedicineSimulationPrompt(medicalCase, prescriptions, timeSkipValue, timeSkipUnit);

        const response = await ai.generateContent({
            contents: prompt
        });

        console.log(`[AI Medicine Simulation] Case: ${medicalCase.id}, Time: ${timeSkipValue} ${timeSkipUnit}`);

        let result;
        try {
            // Attempt to parse JSON from AI response
            const jsonMatch = response.text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                result = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error("No JSON found in AI response");
            }
        } catch (parseError) {
            console.error("Error parsing AI simulation response:", parseError, response.text);
            return res.status(500).json({ error: 'Failed to parse simulation results from AI.' });
        }

        // Update API usage statistics
        if (authResult.uid) {
            try {
                await FirebaseAdminService.incrementApiUsage(authResult.uid);
            } catch (usageError) {
                console.error('Error updating API usage stats (non-fatal):', usageError);
            }
        }

        res.status(200).json(result);

    } catch (error) {
        console.error(`[API Error] simulateMedicineEffect`, error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        res.status(500).json({ error: `Server error: ${errorMessage}` });
    }
}
