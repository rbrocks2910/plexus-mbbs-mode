## Run Locally

1. Install dependencies:
   `npm install`
2. Configure API keys in `.env.local`:
   - **Groq (Primary Provider)**: Set `GROQ_API_KEY` (get from https://console.groq.com/)
     - Set `GROQ_MODEL` to your preferred model (default: `openai/gpt-oss-120b`)
   - **OpenRouter (Fallback Provider)**: Set `OPENROUTER_API_KEY` (get from https://openrouter.ai/)
     - Set `OPENROUTER_MODEL` to your preferred model (default: `anthropic/claude-3.5-sonnet`)
       - Popular options:
         - `anthropic/claude-3.5-sonnet` (recommended for medical applications)
         - `openai/gpt-4` (powerful general model)
         - `openai/gpt-3.5-turbo` (fast and cost-effective)
         - `meta-llama/llama-3.1-405b-instruct` (open-source alternative)
         - `google/gemini-pro` (Google's model)
   - **Gemini (Final Fallback Provider)**: Set `GEMINI_API_KEY` (get from https://makersuite.google.com/app/apikey)
     - Optionally set `GEMINI_MODEL` (default: `gemini-2.5-flash`)
   - The app will use Groq as primary, falling back to OpenRouter, then Gemini if needed
3. Run the app:
   `npm run dev`

## AI Provider Logging (Developer Only)

The app provides comprehensive logging for all AI interactions in server logs for debugging and monitoring:

### Server Logs
- **API Calls**: `[API Call] generateCase - Specialty: Cardiology, Rarity: Common, User: abc123...`
- **AI Success**: `[AI Case Generation SUCCESS] Provider: openrouter, Model: anthropic/claude-3.5-sonnet, Specialty: Cardiology, Disease: Myocardial Infarction`
- **AI Failure**: `[AI Case Generation FAILED] Specialty: Cardiology, Error: API key missing`
- **Fallback Cases**: `[FALLBACK CASE] Using dummy data instead of AI generation - Specialty: Cardiology, Rarity: Common, Error: Network timeout`
- **API Responses**: `[API Response] generateCase SUCCESS - Case ID: gen-123456, Specialty: Cardiology, Diagnosis: Myocardial Infarction`
- **Chat Responses**: `[AI Chat Response] Provider: gemini, Diagnosis: Acute Coronary Syndrome...`
- **Guider Advice**: `[AI Guider Advice] Provider: openrouter, Diagnosis: Pneumonia...`
- **Investigation Results**: `[AI Investigation Result] Provider: openrouter, Test: Chest X-ray, Diagnosis: Pneumonia...`
- **Case Feedback**: `[AI Case Feedback] Provider: gemini, User Diagnosis: Pneumonia..., Correct: Acute Bronchitis...`

### Developer Notifications
- **AI vs Fallback**: Clear distinction between AI-generated cases and fallback dummy data
- **Model Tracking**: Shows which specific AI model/provider was used for each operation
- **Error Tracking**: Detailed error messages when AI generation fails
- **Performance Monitoring**: API call timing and success rates

*Note: AI provider information is not exposed to users - it's only available in server logs for developers.*

## MBBS Year Tracking

The app includes personalized MBBS year tracking to enhance the learning experience:

### Features
- **Smooth Modal**: New users see a beautiful, warm modal asking for their MBBS year
- **Visual Badge**: MBBS year displays as a small numbered badge next to the profile picture
- **Profile Management**: Users can update their MBBS year anytime via the user menu
- **Database Persistence**: Year information is saved with user accounts for developer analytics

### User Experience
- Minimal, focused modal with 4 simple number buttons
- Smooth fade-in animation after login
- Persistent across sessions and devices
- Optional edit functionality in user menu

## Rate Limiting

The app uses **distributed rate limiting via Firestore** to work correctly across all Vercel serverless function instances:

- **Per-User Rate Limiting**: Automatically extracts user ID from auth tokens for authenticated requests
- **IP-Based Fallback**: Falls back to IP address for unauthenticated requests
- **Distributed Storage**: Uses Firestore to share rate limit counters across all function instances
- **Atomic Operations**: Uses Firestore transactions to prevent race conditions
- **Fail-Open**: If Firestore is unavailable, requests are allowed to prevent breaking the app

### Rate Limits by Endpoint:
- **Case Generation**: 10 requests per 5 minutes
- **Chat Responses**: 30 requests per 5 minutes
- **Guider Advice**: 15 requests per 5 minutes
- **Investigation Results**: 20 requests per 5 minutes
- **Case Feedback**: 20 requests per 5 minutes
- **Payment Operations**: 3-5 requests per minute
