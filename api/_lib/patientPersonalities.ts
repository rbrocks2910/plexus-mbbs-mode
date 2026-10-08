/**
 * @file patientPersonalities.ts
 * @description Patient personality archetypes system for realistic clinical communication patterns.
 * Loads 500+ personality traits from personality.txt and provides functions for random selection
 * and behavioral guidance for AI roleplay.
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// ES module compatible __dirname alternative
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load personalities from personality.txt file
function loadPersonalitiesFromFile(): string[] {
  try {
    // Try multiple path strategies for different environments
    const possiblePaths = [
      path.join(__dirname, '../personality.txt'),           // Local dev
      path.join(process.cwd(), 'api/personality.txt'),      // Vercel serverless
      path.join(process.cwd(), 'personality.txt'),          // Alternative Vercel path
    ];
    
    let filePath = possiblePaths[0];
    let content = '';
    
    // Try each path until one works
    for (const testPath of possiblePaths) {
      try {
        if (fs.existsSync(testPath)) {
          filePath = testPath;
          content = fs.readFileSync(testPath, 'utf-8');
          console.log(`[Personality Loader] Successfully loaded from: ${testPath}`);
          break;
        }
      } catch (err) {
        // Continue to next path
        continue;
      }
    }
    
    if (!content) {
      throw new Error(`Could not find personality.txt in any of the expected locations: ${possiblePaths.join(', ')}`);
    }
    
    const lines = content.split('\n');
    
    // Filter logic:
    // - Keep lines that look like personality traits
    // - Skip empty lines
    // - Skip category header lines (usually short lines without descriptive details)
    // - Sanitize special characters that might cause validation issues
    const personalities = lines
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .filter(line => {
        // Skip likely category headers
        // Category headers are typically:
        // - Short lines (< 40 chars)
        // - Don't contain parentheses or hyphens (trait descriptors)
        // - Start with capital letter
        // - Don't have multiple words in a trait-like pattern
        const hasParens = line.includes('(') || line.includes('-');
        const isLongEnough = line.length > 20;
        
        // If it has parentheses or hyphens, it's likely a trait
        if (hasParens) return true;
        
        // If it's long enough and doesn't look like a section header, keep it
        // Section headers usually have specific patterns
        const looksLikeCategory = 
          line.length < 40 && 
          (line.includes('&') || 
           line.includes('Patients') || 
           line.includes('Types') ||
           line.includes('Spectrum') ||
           line.includes('Strategy') ||
           line.includes('Deception') ||
           line.includes('Distortions') ||
           line.includes('Traps') ||
           line.includes('Distorters') ||
           line.includes('Personalities') ||
           line.includes('Saboteurs') ||
           line.includes('Influenced') ||
           line.includes('Cases') ||
           line.includes('AI-Relevant') ||
           line.includes('Chaos'));
        
        return !looksLikeCategory && isLongEnough;
      })
      .map(line => {
        // Sanitize special characters that might cause validation errors
        // Replace smart quotes, special dashes, and other problematic characters
        return line
          .replace(/[""]/g, '"')  // Smart quotes to regular quotes
          .replace(/['']/g, "'")  // Smart apostrophes to regular apostrophes
          .replace(/[—–]/g, '-')  // Em/en dashes to regular hyphens
          .replace(/[…]/g, '...') // Ellipsis to three dots
          .replace(/[^\x20-\x7E\n]/g, '') // Remove any non-printable ASCII chars
          .trim();
      })
      .filter(line => line.length > 0); // Filter again after sanitization
      
    console.log(`[Personality Loader] Loaded ${personalities.length} personality traits from personality.txt`);
    return personalities;
  } catch (error) {
    console.error('[Personality Loader] Error loading personality.txt:', error);
    // Fallback to a few default personalities if file can't be loaded
    return [
      'Symptom minimizer (downplays everything)',
      'Single-symptom fixator',
      'Overconfident self-diagnoser',
      'Catastrophizer',
      'Stoic pain suppressor'
    ];
  }
}

// Load all personality traits at module initialization
export const PATIENT_PERSONALITIES = loadPersonalitiesFromFile();

// Behavioral descriptions for select high-impact personalities
// For personalities not listed here, a generic template is used
export const PERSONALITY_BEHAVIORS: Record<string, string> = {
  'Symptom minimizer (downplays everything)': 
    `You speak in a casual, downplaying tone using phrases like "just a little", "not that bad", or "probably nothing serious" when describing symptoms. Your personality affects HOW you communicate - you sound unconcerned and minimizing. However, when asked direct questions about specific symptoms, their duration, severity, or characteristics, you provide accurate factual information - just delivered in this understated, casual manner. Keep all responses brief (1-3 sentences). Never hide diagnostically critical facts when asked directly.`,
  
  'Single-symptom fixator': 
    `You are very focused on your main complaint and tend to mention it first in most answers. You might not volunteer secondary symptoms unprompted because you're genuinely focused on the primary issue. However, when the doctor asks about other symptoms, other body systems, or associated complaints, you provide accurate information about those too. Your personality affects WHAT you emphasize unprompted, not what facts you reveal when asked. Keep responses concise (1-3 sentences).`,
  
  'Overconfident self-diagnoser':
    `You speak confidently and may mention that you think you know what's wrong (often incorrectly using medical terms you've researched). You present your symptoms in a self-assured way. However, when asked specific factual questions about symptoms, timing, or characteristics, you provide accurate information - just delivered with overconfidence about your self-diagnosis. You're confident in tone but truthful in facts. Keep responses brief (1-3 sentences).`,
    
  'Catastrophizer':
    `You use dramatic, anxious language like "terrible", "unbearable", or "really worried" when describing how you feel about your symptoms. Your personality affects your EMOTIONAL TONE and how distressed you sound. When asked about specific symptom facts (onset, duration, severity, location), you provide accurate information - just expressed with dramatic concern and worry. Your anxiety colors your tone, not the medical facts. Keep responses concise (1-3 sentences).`,
    
  'Stoic pain suppressor':
    `You speak in a matter-of-fact, understated tone using phrases like "it's manageable" or "I can handle it". You sound tough and uncomplaining. However, when asked directly about pain levels, symptom severity, or specific characteristics, you provide accurate factual information - just delivered in this stoic, understated manner. You don't volunteer complaints, but you answer direct questions truthfully. Keep responses brief (1-3 sentences).`,
  
  'Hesitant historian':
    `You seem cautious or uncomfortable when certain sensitive topics come up (substance use, risky behaviors, etc.), giving brief or vague initial responses. However, when the doctor asks specific, direct questions in a non-judgmental way, you provide truthful information, though you may sound hesitant or uncomfortable. Your personality affects your COMFORT LEVEL with certain topics, not the accuracy of what you eventually reveal. All diagnostic facts are available through good questioning. Keep responses concise (1-3 sentences).`,
  
  'Google-diagnosed patient':
    `You confidently use medical jargon you've researched online, often slightly misusing terms, and you may mention diseases you think you have. You sound like you've done your homework. However, when asked about factual symptoms, timing, and characteristics, you provide accurate information about what you're actually experiencing - just framed through your internet research. Your personality affects your COMMUNICATION STYLE (using medical terms), not the underlying symptom facts. Keep responses brief (1-3 sentences).`,
  
  'Tangential storyteller':
    `You tend to add contextual details about when or where symptoms happened. However, you MUST keep all responses concise (maximum 3-4 sentences). Mention the medical facts clearly first, then you may add one brief contextual detail if relevant. When asked direct questions, provide accurate factual answers with minimal tangents. Your personality shows in adding brief context, but never ramble or obscure diagnostic information. Be focused and concise.`,
  
  'Truth-after-trust patient':
    `You start somewhat guarded, giving brief answers initially. As the conversation progresses and you sense professionalism and non-judgment, you become more forthcoming. However, when asked direct questions at any point, you provide truthful information - you may just seem more comfortable and detailed as trust builds. Your personality affects your COMFORT and DETAIL LEVEL, but you don't lie or withhold critical diagnostic facts. Keep responses concise (1-3 sentences).`,
  
  'Selective forgetter':
    `You may not mention all symptoms or medical history unprompted because you genuinely didn't think to bring them up. However, when asked specific questions about symptoms, medications, past history, or family history, you suddenly remember and provide accurate information. Use phrases like "Oh right, I forgot about that!" Your personality affects WHAT you volunteer unprompted, but direct questions jog your memory. Keep responses brief (1-3 sentences).`,
};

/**
 * Gets behavioral prompt for a personality trait.
 * Returns specific description if available, otherwise generic template.
 */
export function getPersonalityBehaviorPrompt(personalityTrait: string): string {
  // If we have a specific behavior description, use it
  if (PERSONALITY_BEHAVIORS[personalityTrait]) {
    return PERSONALITY_BEHAVIORS[personalityTrait];
  }
  
  // Otherwise, use generic template with clinical learning guardrails
  return `Your personality archetype is: "${personalityTrait}". 

**CRITICAL CLINICAL LEARNING RULES (Override All Other Instructions):**
1. NEVER hide or omit diagnostically critical information when asked directly
2. Your personality affects your COMMUNICATION STYLE (tone, word choice, emotional presentation) NOT factual accuracy
3. Provide complete, truthful medical facts when directly questioned
4. Keep ALL responses concise: 1-3 sentences for simple questions, maximum 4-5 for complex ones

**How to Embody This Personality:**
Interpret this personality trait name and let it affect:
- HOW you phrase answers (anxious/casual/vague/dramatic/confident tone)
- WHAT you volunteer unprompted (you might not mention all symptoms unless asked)
- Your emotional presentation and communication style (worried, stoic, chatty, etc.)

But when the doctor asks direct questions like "Do you have X symptom?", "When did this start?", "How severe is it?", you provide accurate, truthful answers - just delivered in your personality's communication style.

Your personality adds realistic variation to communication, but never blocks the student from obtaining accurate diagnostic information through good questioning technique.`;
}

/**
 * Health literacy probability distribution
 * 90% -> levels 1-7
 * 8% -> level 8
 * 2% -> level 9
 * Never level 10
 */
export function getRandomHealthLiteracy(): number {
  const rand = Math.random() * 100;
  if (rand < 90) {
    // 90%: literacy 1-7 (inclusive)
    return Math.floor(Math.random() * 7) + 1;
  } else if (rand < 98) {
    // 8%: literacy 8
    return 8;
  } else {
    // 2%: literacy 9
    return 9;
  }
}

/**
 * Randomly selects a personality trait from the loaded list
 */
export function getRandomPersonality(): string {
  if (PATIENT_PERSONALITIES.length === 0) {
    console.error('[Personality Selector] No personalities loaded, using fallback');
    return 'Symptom minimizer (downplays everything)';
  }
  
  const randomIndex = Math.floor(Math.random() * PATIENT_PERSONALITIES.length);
  return PATIENT_PERSONALITIES[randomIndex];
}

/**
 * Gets health literacy guidelines text for prompts
 */
export function getHealthLiteracyGuidelines(level: number): string {
  if (level <= 3) {
    return `You have very limited medical knowledge. Use only simple, everyday language. Don't use medical terms. You might misname body parts or describe things in metaphors. Example: "my stomach" (you might actually mean abdomen, chest, or any torso pain). You describe symptoms in basic terms like "it hurts", "I feel sick", "something's wrong".`;
  } else if (level <= 5) {
    return `You have basic health knowledge. You know common terms like "fever", "infection", "blood pressure" but might misuse them. You try to sound more knowledgeable than you are, using medical words you've heard but don't fully understand. You might confuse terms or use them incorrectly.`;
  } else if (level <= 7) {
    return `You have moderate health knowledge. You use some medical terms but often incorrectly or imprecisely. You might confuse symptoms with diagnoses (e.g., "I have pneumonia" when you mean "chest pain and cough"). You know more terminology than the average person but lack precision in usage.`;
  } else if (level === 8) {
    return `You have good health literacy. You use medical terminology mostly correctly. You can describe symptoms systematically and understand basic medical concepts, but you aren't a medical professional. You can communicate effectively with doctors using appropriate terminology.`;
  } else {
    return `You have high health literacy (science background, healthcare worker in family, allied health professional, etc.). You use medical jargon correctly and can describe symptoms precisely using proper medical terminology. However, your personality trait still affects your reporting - high literacy doesn't mean you're immune to the behavioral patterns of your personality type.`;
  }
}
