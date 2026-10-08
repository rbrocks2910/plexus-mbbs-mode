# Chat Error Fix - Personality Traits System

## Problem Summary
You encountered two errors when chatting with the patient after leaving the conversation idle:

```
I'm sorry, I feel a bit confused right now. There might be a connection issue. (Unknown API error during chat.)

[Personality Loader] Error loading personality.txt: ReferenceError: __dirname is not defined
[Validation Error] getChatResponse - Text contains invalid characters
```

## Root Causes

### 1. `__dirname` Error ❌
**Location:** `api/_lib/patientPersonalities.ts:14`

**Problem:** 
- The code was using `__dirname` which is a CommonJS variable
- We're using ES modules (`type: "module"` in package.json)
- In ES modules, `__dirname` doesn't exist, causing a crash

**Original Code:**
```typescript
const filePath = path.join(__dirname, '../personality.txt');
```

### 2. Text Validation Error ❌
**Location:** `api/_lib/validation.ts:337` and personality traits

**Problem:**
- Personality traits from `personality.txt` contained special Unicode characters (smart quotes, em dashes, etc.)
- The validation regex was too strict and rejected these characters
- When the AI included the personality trait in chat responses, validation failed

## Solutions Implemented ✅

### Fix 1: ES Module Compatible Path Resolution
**File:** `api/_lib/patientPersonalities.ts`

```typescript
import { fileURLToPath } from 'url';

// ES module compatible __dirname alternative
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Try multiple path strategies for different environments
const possiblePaths = [
  path.join(__dirname, '../personality.txt'),           // Local dev
  path.join(process.cwd(), 'api/personality.txt'),      // Vercel serverless
  path.join(process.cwd(), 'personality.txt'),          // Alternative Vercel path
];

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
    continue;
  }
}
```

**Benefits:**
- ✅ Works in ES modules
- ✅ Tries multiple paths for different deployment environments
- ✅ Better error handling and logging
- ✅ Graceful fallback to default personalities if file not found

### Fix 2: Sanitize Special Characters
**File:** `api/_lib/patientPersonalities.ts`

Added character sanitization when loading personalities:

```typescript
.map(line => {
  // Sanitize special characters that might cause validation errors
  return line
    .replace(/[""]/g, '"')  // Smart quotes to regular quotes
    .replace(/['']/g, "'")  // Smart apostrophes to regular apostrophes
    .replace(/[—–]/g, '-')  // Em/en dashes to regular hyphens
    .replace(/[…]/g, '...') // Ellipsis to three dots
    .replace(/[^\x20-\x7E\n]/g, '') // Remove any non-printable ASCII chars
    .trim();
})
```

### Fix 3: More Lenient Validation Regex
**File:** `api/_lib/validation.ts`

Updated the regex to allow more Unicode characters:

```typescript
// OLD (too strict):
alphanumeric: /^[a-zA-Z0-9\s\-_.,!?;:'"(){}[\]|@#$%^&*+=<>~`\/\n\r\t]+$/,

// NEW (more lenient):
alphanumeric: /^[a-zA-Z0-9\s\-_.,!?;:'"(){}[\]|@#$%^&*+=<>~`\/\n\r\t\u00A0-\uFFFF]+$/,
```

**Also added debugging** to log which characters are causing validation issues:

```typescript
if (text.length <= 2000 && !REGEX.alphanumeric.test(text)) {
  // Log which characters are causing the issue for debugging
  const invalidChars = text.split('').filter(char => {
    const code = char.charCodeAt(0);
    const allowed = /[a-zA-Z0-9\s\-_.,!?;:'"(){}[\]|@#$%^&*+=<>~`\/\n\r\t\u00A0-\uFFFF]/.test(char);
    return !allowed;
  });
  
  if (invalidChars.length > 0) {
    console.error('[Validation Debug] Invalid characters found:', {
      chars: invalidChars,
      codes: invalidChars.map(c => c.charCodeAt(0)),
      textPreview: text.substring(0, 100)
    });
  }
  
  errors.push('Text contains invalid characters');
}
```

## Why The Error Happened During Chat

1. **Case generation succeeded** because it ran before the error
2. **Patient profile included personality trait** with special characters
3. **When you sent a chat message**, the backend:
   - Tried to load `personality.txt` → crashed on `__dirname`
   - Fell back to default personalities (with special chars)
   - AI generated response including the personality trait
   - **Validation rejected the response** due to special characters
   - Frontend received error: "Unknown API error during chat"

## Testing

The fix has been deployed to Vercel. To verify:

1. ✅ Start a new case (should load personality traits without errors)
2. ✅ Chat with the patient (should work even after leaving idle)
3. ✅ Check Vercel logs - you should see: `[Personality Loader] Successfully loaded from: ...`
4. ✅ No more `__dirname` errors
5. ✅ No more "Text contains invalid characters" errors

## Prevention

- **Character sanitization** now happens at load time
- **Multiple path fallbacks** ensure the file is found in any environment
- **Better error logging** helps debug issues faster
- **More lenient validation** allows international text and personality traits
- **Graceful fallbacks** prevent the entire system from breaking

## Deployed

Commit: `c51c90d` - "Fix __dirname error and text validation for personality traits"
Status: ✅ Deployed to Vercel
