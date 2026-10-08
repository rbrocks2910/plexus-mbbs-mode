import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ai } from './_lib/ai.js';
import { loadAllDiseaseDBs } from './_lib/db.js';
import { getCaseGenerationPrompt } from './_lib/prompts.js';
import { medicalCaseSchema } from './_lib/schemas.js';
import { Specialty, RaritySelection } from './_lib/types.js';
import { verifyAuth, AuthResult } from './_lib/auth.js';
import { rateLimit } from './_lib/rateLimit.js';
import { FirebaseAdminService } from './_lib/firebaseAdminService.js';
import { validateSpecialty, validateTextField, ValidationResult } from './_lib/validation.js';
import { getDiseasesForSubject } from './_lib/mbbsSubjects.js';
import { getRandomFMTTopic, FMTTopic } from './_lib/fmtTopics.js';
import { getRandomPersonality, getRandomHealthLiteracy } from './_lib/patientPersonalities.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Only POST requests allowed' });
    }

    // Apply rate limiting - limit to 10 requests per 5 minutes per authenticated user for case generation
    const rateLimitResult = await rateLimit(req, 5 * 60 * 1000, 10); // 10 requests per 5 minutes
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
        console.log(`[API Call] generateCase - Specialty: ${req.body?.specialty}, Rarity: ${req.body?.rarity}, MBBS Mode: ${req.body?.mbbsMode?.enabled ? req.body.mbbsMode.subjectName : 'Off'}, User: ${authResult.uid?.substring(0, 8)}...`);

        const body = req.body;
        // Basic validation of the request body structure
        if (
            !body ||
            typeof body !== 'object' ||
            typeof body.specialty !== 'string' ||
            typeof body.rarity !== 'string' ||
            (body.recentDiagnoses && !Array.isArray(body.recentDiagnoses)) ||
            (body.mbbsMode && (typeof body.mbbsMode !== 'object' || typeof body.mbbsMode.subjectId !== 'string'))
        ) {
             return res.status(400).json({ error: 'Invalid request body. "specialty" (string), "rarity" (string), optional "recentDiagnoses" (array), and optional "mbbsMode" (object) are required.' });
        }

        // Detailed validation of input parameters
        const specialtyValidation = validateSpecialty(body.specialty);
        const rarityValidation = validateTextField(body.rarity, 50);
        const recentDiagnosesValidation = (!body.recentDiagnoses || Array.isArray(body.recentDiagnoses))
          ? { isValid: true, errors: [] } as ValidationResult
          : { isValid: false, errors: ['recentDiagnoses must be an array'] };

        // Combine validation results
        const validationErrors: string[] = [];

        if (!specialtyValidation.isValid) {
          validationErrors.push(...specialtyValidation.errors);
        }

        if (!rarityValidation.isValid) {
          validationErrors.push(...rarityValidation.errors);
        }

        if (!recentDiagnosesValidation.isValid) {
          validationErrors.push(...recentDiagnosesValidation.errors);
        }

        if (validationErrors.length > 0) {
          console.error(`[Validation Error] generateCase - User: ${authResult.uid?.substring(0, 8)}..., Specialty: ${body.specialty}, Errors:`, validationErrors);
          return res.status(400).json({
            error: 'Validation failed',
            details: validationErrors
          });
        }
        const { specialty, rarity, recentDiagnoses = [], mbbsMode } = body as { 
          specialty: Specialty, 
          rarity: RaritySelection, 
          recentDiagnoses?: string[],
          mbbsMode?: { enabled: boolean; subjectId: string; subjectName: string }
        };

        let diseaseList: { name: string; rarity: string }[];
        let specialtyToUse: string = specialty;
        let fmtTopic: FMTTopic | undefined = undefined;

        // Check if MBBS mode is enabled
        if (mbbsMode?.enabled && mbbsMode.subjectId) {
            console.log(`[MBBS Mode] Subject: ${mbbsMode.subjectName} (${mbbsMode.subjectId})`);
            
            // Check if this is FMT mode (Forensic Medicine & Toxicology)
            if (mbbsMode.subjectId === 'fmt') {
                // Randomly select an FMT topic from any zone
                fmtTopic = getRandomFMTTopic();
                console.log(`[FMT Mode] Selected Topic: ${fmtTopic.name}, Zone: ${fmtTopic.zone}`);
                
                // Use the topic's related conditions as the disease list
                diseaseList = fmtTopic.relatedConditions.map(name => ({
                    name,
                    rarity: 'Common'
                }));
                
                specialtyToUse = 'Forensic Medicine';
            } else {
                // Standard MBBS mode (e.g., PSM)
                // Get diseases from MBBS subject
                const mbbsDiseases = getDiseasesForSubject(mbbsMode.subjectId);
                
                if (mbbsDiseases.length === 0) {
                    return res.status(400).json({ error: `No diseases found for MBBS subject "${mbbsMode.subjectName}".` });
                }

                // Convert MBBS disease names to disease objects with default rarity
                // For MBBS mode, we treat all diseases as having a more uniform distribution
                diseaseList = mbbsDiseases.map(name => ({
                    name,
                    rarity: 'Common' // Default rarity for MBBS diseases
                }));

                // Use the subject name as specialty for context
                specialtyToUse = mbbsMode.subjectName;
            }
        } else {
            // Standard mode: use specialty-based disease databases
        const combinedDB = loadAllDiseaseDBs();

        if (Object.keys(combinedDB).length === 0) {
            return res.status(500).json({ error: "All disease databases are empty or failed to load." });
        }

        if (specialty === Specialty['General Medicine'] || !combinedDB.hasOwnProperty(specialty)) {
            const availableSpecialties = Object.keys(combinedDB);
            specialtyToUse = availableSpecialties[Math.floor(Math.random() * availableSpecialties.length)];
        }

            diseaseList = combinedDB[specialtyToUse as keyof typeof combinedDB] || [];

        if (diseaseList.length === 0) {
            return res.status(500).json({ error: `No diseases found for specialty "${specialtyToUse}".` });
            }
        }

        let eligibleDiseases = diseaseList.filter(d => !recentDiagnoses.includes(d.name));
        if (eligibleDiseases.length === 0) {
            eligibleDiseases = diseaseList;
        }

        let selectedPool: { name: string; rarity: string }[] = [];

        if (rarity === 'Any') {
            const commonPool = eligibleDiseases.filter(d => d.rarity === 'Very Common' || d.rarity === 'Common');
            const uncommonPool = eligibleDiseases.filter(d => d.rarity === 'Uncommon');
            const rarePool = eligibleDiseases.filter(d => d.rarity === 'Rare');
            const veryRarePool = eligibleDiseases.filter(d => d.rarity === 'Very Rare');

            const pools = [
                { pool: commonPool, weight: 0.60 },
                { pool: uncommonPool, weight: 0.30 },
                { pool: rarePool, weight: 0.05 },
                { pool: veryRarePool, weight: 0.05 },
            ];

            const availablePools = pools.filter(p => p.pool.length > 0);

            if (availablePools.length > 0) {
                const totalWeight = availablePools.reduce((sum, p) => sum + p.weight, 0);
                let random = Math.random() * totalWeight;

                for (const p of availablePools) {
                    if (random < p.weight) {
                        selectedPool = p.pool;
                        break;
                    }
                    random -= p.weight;
                }
                if (selectedPool.length === 0) {
                     selectedPool = availablePools[availablePools.length - 1].pool;
                }
            } else {
                selectedPool = eligibleDiseases;
            }
        } else {
            selectedPool = eligibleDiseases.filter(d => d.rarity === rarity);
            if (selectedPool.length === 0) {
                selectedPool = eligibleDiseases;
            }
        }

        if (selectedPool.length === 0) {
            return res.status(500).json({ error: `No eligible diseases found for specialty "${specialtyToUse}" after filtering.` });
        }

        const selectedDisease = selectedPool[Math.floor(Math.random() * selectedPool.length)];

        // Assign personality trait and health literacy for this patient
        const assignedPersonality = getRandomPersonality();
        const assignedHealthLiteracy = getRandomHealthLiteracy();

        // Generate prompt with FMT zone context if applicable
        const prompt = fmtTopic 
            ? getCaseGenerationPrompt(specialtyToUse as Specialty, selectedDisease, assignedPersonality, assignedHealthLiteracy, fmtTopic.zone)
            : getCaseGenerationPrompt(specialtyToUse as Specialty, selectedDisease, assignedPersonality, assignedHealthLiteracy);

        const response = await ai.generateContent({
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: medicalCaseSchema,
                temperature: 1.0,
                seed: Math.floor(Math.random() * 1000000),
            }
        });

        console.log(`[AI Case Generation SUCCESS] Provider: ${response.provider}, Model: ${response.provider === 'openrouter' ? (process.env.OPENROUTER_MODEL || 'anthropic/claude-3.5-sonnet') : (process.env.GEMINI_MODEL || 'gemini-2.5-flash')}, Specialty: ${specialtyToUse}, Disease: ${selectedDisease.name}`);

        const caseData = JSON.parse(response.text || '{}');

        if (!caseData || typeof caseData !== 'object') {
            throw new Error('Invalid AI response: expected JSON object');
        }

        if (caseData.underlyingDiagnosis !== selectedDisease.name) {
             caseData.underlyingDiagnosis = selectedDisease.name;
             caseData.rarity = selectedDisease.rarity;
        }

        const finalCase = {
            ...caseData,
            id: `gen-${Date.now()}`,
            specialty: specialtyToUse as Specialty,
            status: 'active',
            ...(mbbsMode?.enabled && { 
                mbbsMode: {
                    ...mbbsMode,
                    topicName: selectedDisease.name,
                    universityQuestion: caseData.mbbsMode?.universityQuestion || `Discuss the etiopathogenesis, clinical presentation, diagnostic workup, and evidence-based management of ${selectedDisease.name}.`,
                    modelAnswer: caseData.mbbsMode?.modelAnswer || `Comprehensive university-level examination notes for ${selectedDisease.name}.`
                }
            }),
            ...(fmtTopic && { 
                fmtMode: { 
                    enabled: true, 
                    zone: fmtTopic.zone,
                    topicId: fmtTopic.id,
                    topicName: fmtTopic.name
                }
            })
        };

        // Update API usage statistics after successful processing, but do it carefully to not affect the response
        if (authResult.uid) {
            try {
                await FirebaseAdminService.incrementApiUsage(authResult.uid);
            } catch (usageError) {
                console.error('Error updating API usage stats (non-fatal):', usageError);
                // Important: Don't let usage tracking errors affect the main API response
            }
        }

        console.log(`[API Response] generateCase SUCCESS - Case ID: ${finalCase.id}, Specialty: ${finalCase.specialty}, Diagnosis: ${finalCase.underlyingDiagnosis}, MBBS Mode: ${mbbsMode?.enabled ? mbbsMode.subjectName : 'Off'}`);
        res.status(200).json(finalCase);

    } catch (error) {
        console.error(`[AI Case Generation FAILED] Specialty: ${req.body?.specialty}, Error:`, error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        res.status(500).json({ error: `Failed to generate patient case: ${errorMessage}` });
    }
}