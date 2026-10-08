import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ai } from './_lib/ai.js';
import { verifyAuth, AuthResult } from './_lib/auth.js';
import { rateLimit } from './_lib/rateLimit.js';
import { FirebaseAdminService } from './_lib/firebaseAdminService.js';
import { validateTextField, ValidationResult } from './_lib/validation.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Only POST requests allowed' });
    }

    // Apply rate limiting - 30 requests per 5 minutes for answer generation
    const rateLimitResult = await rateLimit(req, 5 * 60 * 1000, 30);
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

    const body = req.body;
    
    // Validate request body
    if (!body || typeof body !== 'object' || !body.question || !body.context) {
        return res.status(400).json({ 
            error: 'Invalid request body. "question" and "context" are required.' 
        });
    }

    // Detailed validation of input parameters
    const questionValidation = validateTextField(body.question, 500);
    const contextValidation = validateTextField(body.context, 200);

    const validationErrors: string[] = [];

    if (!questionValidation.isValid) {
        validationErrors.push(...questionValidation.errors);
    }

    if (!contextValidation.isValid) {
        validationErrors.push(...contextValidation.errors);
    }

    if (validationErrors.length > 0) {
        return res.status(400).json({
            error: 'Validation failed',
            details: validationErrors
        });
    }

    const { question, context, subject } = body as { 
        question: string; 
        context: string; 
        subject?: string;
    };

    try {
        // Generate comprehensive answer using AI
        const answerPrompt = `Provide a comprehensive MBBS-level answer to this university exam question:

Question: "${question}"
Context: ${context}

Generate a detailed, well-structured answer suitable for MBBS students.`;

        const response = await ai.generateContent({
            contents: answerPrompt,
            config: {
                responseMimeType: "text/plain",
            }
        });

        console.log(`[Exam Answer Generated] Subject: ${subject || 'unknown'}, Context: ${context.substring(0, 50)}...`);

        // Update API usage statistics
        if (authResult.uid) {
            try {
                await FirebaseAdminService.incrementApiUsage(authResult.uid);
            } catch (usageError) {
                console.error('Error updating API usage stats (non-fatal):', usageError);
            }
        }
        
        res.status(200).json({ answer: response.text || 'Unable to generate answer.' });

    } catch (error) {
        console.error('Error generating exam answer:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        res.status(500).json({ 
            error: 'Failed to generate answer',
            message: errorMessage
        });
    }
}

