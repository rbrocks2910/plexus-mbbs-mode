import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ai } from './_lib/ai.js';
import { getFeedbackPrompt } from './_lib/prompts.js';
import { caseFeedbackSchema, examQuestionsOnlySchema } from './_lib/schemas.js';
import { MedicalCase, ChatMessage } from './_lib/types.js';
import { verifyAuth, AuthResult } from './_lib/auth.js';
import { rateLimit } from './_lib/rateLimit.js';
import { FirebaseAdminService } from './_lib/firebaseAdminService.js';
import {
  validateTextField,
  validateConfidence,
  validateArray,
  ValidationResult
} from './_lib/validation.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Only POST requests allowed' });
    }

    // Apply rate limiting - limit to 20 requests per 5 minutes per authenticated user for feedback generation
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

    const body = req.body;
    // Robust validation of the request body
    if (
        !body ||
        typeof body !== 'object' ||
        !body.medicalCase || typeof body.medicalCase !== 'object' ||
        typeof body.userDiagnosis !== 'string' ||
        typeof body.userConfidence !== 'number' ||
        !Array.isArray(body.chatHistory) ||
        !Array.isArray(body.differentialDiagnoses) ||
        (body.prescriptions && !Array.isArray(body.prescriptions)) ||
        (body.simulationHistory && !Array.isArray(body.simulationHistory))
    ) {
        return res.status(400).json({ error: "Invalid request body. Missing or malformed required fields." });
    }

    // Detailed validation of input parameters
    const userDiagnosisValidation = validateTextField(body.userDiagnosis, 500);
    const userConfidenceValidation = validateConfidence(body.userConfidence);
    const differentialDiagnosesValidation = validateArray(
      body.differentialDiagnoses,
      (item: string) => validateTextField(item, 200),
      20
    );
    const chatHistoryValidation = validateArray(
      body.chatHistory,
      (message: ChatMessage) => validateTextField(message.text, 2000),
      50
    );

    // Combine validation results
    const validationErrors: string[] = [];

    if (!userDiagnosisValidation.isValid) {
      validationErrors.push(...userDiagnosisValidation.errors);
    }

    if (!userConfidenceValidation.isValid) {
      validationErrors.push(...userConfidenceValidation.errors);
    }

    if (!differentialDiagnosesValidation.isValid) {
      validationErrors.push(...differentialDiagnosesValidation.errors);
    }

    if (!chatHistoryValidation.isValid) {
      validationErrors.push(...chatHistoryValidation.errors);
    }

    if (validationErrors.length > 0) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validationErrors
      });
    }

    const { medicalCase, userDiagnosis, userConfidence, chatHistory, differentialDiagnoses, prescriptions, simulationHistory } = body as {
        medicalCase: MedicalCase,
        userDiagnosis: string,
        userConfidence: number,
        chatHistory: ChatMessage[],
        differentialDiagnoses: string[],
        prescriptions?: any[],
        simulationHistory?: any[]
    };

    try {
        const prompt = getFeedbackPrompt(medicalCase, userDiagnosis, userConfidence, chatHistory, differentialDiagnoses, prescriptions, simulationHistory);

        const response = await ai.generateContent({
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: caseFeedbackSchema,
            }
        });

        console.log(`[AI Case Feedback] Provider: ${response.provider}, User Diagnosis: ${userDiagnosis.substring(0, 50)}..., Correct: ${medicalCase.underlyingDiagnosis.substring(0, 50)}...`);

        const result = JSON.parse(response.text || '{}');

        // Normalize differentialDiagnosisAnalysis to strings to avoid rendering objects in React
        if (Array.isArray((result as any).differentialDiagnosisAnalysis)) {
            (result as any).differentialDiagnosisAnalysis = (result as any).differentialDiagnosisAnalysis.map((item: any) => {
                if (typeof item === 'string') return item;
                if (item && typeof item === 'object') {
                    const { userDiagnosis, relevance, analysis } = item as any;
                    const parts: string[] = [];
                    if (userDiagnosis) parts.push(`Dx: ${userDiagnosis}`);
                    if (relevance) parts.push(`Relevance: ${relevance}`);
                    if (analysis) parts.push(`Analysis: ${analysis}`);
                    return parts.join(' | ') || JSON.stringify(item);
                }
                return String(item);
            });
        }

        // Generate university exam questions if in MBBS mode (PSM or FMT)
        if (medicalCase.mbbsMode?.enabled) {
            try {
                const isFMT = medicalCase.mbbsMode.subjectId === 'fmt';
                const topicContext = isFMT 
                    ? medicalCase.fmtMode?.topicName 
                    : medicalCase.underlyingDiagnosis;
                
                // Generate concise, direct exam questions
                const examPrompt = `Generate exactly 2 MBBS university exam questions about: "${topicContext}".

Requirements:
- Keep questions SHORT and DIRECT (1-2 sentences max)
- Use clear, concise wording
- Cover comprehensive topics but ask directly
- Format like real exam questions

Examples of good question formats:
- "Define [topic] and enumerate its types."
- "Describe the clinical features of [topic]."
- "Explain the management protocol for [topic]."

Format as JSON with array of questions, each having only a 'question' field.`;

                const examResponse = await ai.generateContent({
                    contents: examPrompt,
                    config: {
                        responseMimeType: "application/json",
                        responseSchema: examQuestionsOnlySchema,
                    }
                });

                const examData = JSON.parse(examResponse.text || '{"questions":[]}');
                // Store questions with context for later answer generation
                result.universityExamQuestions = (examData.questions || []).map((q: { question: string }) => ({
                    question: q.question,
                    context: topicContext || 'Unknown',
                    subject: medicalCase.mbbsMode?.subjectId || (isFMT ? 'fmt' : 'psm')
                }));
                
                console.log(`[${isFMT ? 'FMT' : 'PSM'} Exam Questions Generated] Context: ${topicContext}, Questions: ${result.universityExamQuestions.length}`);
            } catch (examError) {
                console.error('Error generating exam questions (non-fatal):', examError);
                // Don't fail the entire feedback if exam questions fail - it's a bonus feature
                result.universityExamQuestions = [];
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
        console.error("Error in /api/getCaseFeedback:", error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        res.status(500).json({
            correctness: 'Partially Correct',
            reasoningAnalysis: `An error occurred while generating feedback: ${errorMessage}`,
            whatWentWell: [],
            areasForImprovement: ['Check application logs for Gemini API errors.'],
            keyMissedClues: [],
            differentialDiagnosisAnalysis: ['Could not analyze differential diagnosis list due to a server error.'],
            finalDiagnosisExplanation: `The correct diagnosis was ${medicalCase?.underlyingDiagnosis || 'unknown'}.`
        });
    }
}