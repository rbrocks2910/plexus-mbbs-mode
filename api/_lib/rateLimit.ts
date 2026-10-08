import { VercelRequest } from '@vercel/node';
import admin from 'firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';

// Initialize Firebase Admin SDK if credentials are present
if (!admin.apps.length) {
  try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      const serviceAccount = JSON.parse(
        Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_KEY, 'base64').toString()
      );
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } else if (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_PROJECT_ID) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
    }
  } catch (error) {
    // If Firebase Admin is not initialized or fails, fail open
  }
}

// Get Firestore instance safely
const getDb = () => {
  if (admin.apps.length > 0) {
    try {
      return admin.firestore();
    } catch {
      return null;
    }
  }
  return null;
};

/**
 * Try to extract user ID from auth token without full verification
 * Returns undefined if token is missing or invalid
 */
async function extractUserIdFromToken(req: VercelRequest): Promise<string | undefined> {
  try {
    const authHeader = Array.isArray(req.headers.authorization) 
      ? req.headers.authorization[0] 
      : req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return undefined;
    }

    const token = authHeader.split('Bearer ')[1];
    // Lightweight verification - just decode without full validation
    // This is safe because we're only using it for rate limiting, not authorization
    const decodedToken = await admin.auth().verifyIdToken(token);
    return decodedToken.uid;
  } catch (error) {
    // Token invalid or missing - that's fine, we'll use IP-based rate limiting
    return undefined;
  }
}

/**
 * Get a unique client key for rate limiting
 * Prefers user ID if available, falls back to IP address
 */
function getClientKey(req: VercelRequest, userId?: string): string {
  if (userId) {
    return `user:${userId}`;
  }
  
  // Fallback to IP-based key
  const ip = (req.headers['x-forwarded-for'] as string) || req.socket?.remoteAddress || 'unknown';
  const userAgent = req.headers['user-agent'] || 'unknown';
  // Use first IP if x-forwarded-for contains multiple (comma-separated)
  const clientIp = ip.split(',')[0].trim();
  return `ip:${clientIp}:${userAgent.substring(0, 50)}`;
        }

/**
 * Distributed rate limiting using Firestore
 * Works across all Vercel serverless function instances
 */
export const rateLimit = async (
    req: VercelRequest, 
  windowMs: number = 60 * 1000, // 1 minute
  max: number = 10, // 10 requests
  userId?: string // Optional user ID for per-user rate limiting (if not provided, will try to extract from token)
): Promise<{ allowed: boolean; remaining: number; resetTime: number }> => {
  try {
    // Try to get user ID from token if not provided
    const effectiveUserId = userId || await extractUserIdFromToken(req);
    const clientKey = getClientKey(req, effectiveUserId);
    const now = Date.now();
    const resetTime = now + windowMs;
    
    const db = getDb();
    if (!db || process.env.AUTH_DISABLED === 'true') {
      return { allowed: true, remaining: max - 1, resetTime };
    }

    // Use Firestore collection for distributed rate limiting
    const rateLimitRef = db.collection('rateLimits').doc(clientKey);
    
    // Use Firestore transaction for atomic increment
    return await db.runTransaction(async (transaction) => {
      const doc = await transaction.get(rateLimitRef);
      
      if (!doc.exists) {
        // First request in this window
        transaction.set(rateLimitRef, {
          count: 1,
          resetTime: Timestamp.fromMillis(resetTime),
          lastRequest: Timestamp.now(),
          createdAt: Timestamp.now(),
        });
        return { 
          allowed: true, 
          remaining: max - 1, 
          resetTime 
        };
      }
      
      const data = doc.data()!;
      const existingResetTime = data.resetTime.toMillis();
      
      // Check if window has expired
      if (now > existingResetTime) {
        // Window expired, reset counter
        transaction.set(rateLimitRef, {
          count: 1,
          resetTime: Timestamp.fromMillis(resetTime),
          lastRequest: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });
        return { 
          allowed: true, 
          remaining: max - 1, 
          resetTime 
        };
      }
      
      // Check if rate limit exceeded
      if (data.count >= max) {
      return { 
        allowed: false, 
        remaining: 0, 
          resetTime: existingResetTime 
      };
    }

      // Increment counter atomically
      transaction.update(rateLimitRef, {
        count: admin.firestore.FieldValue.increment(1),
        lastRequest: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      
      const newCount = data.count + 1;
      return { 
        allowed: true, 
        remaining: max - newCount, 
        resetTime: existingResetTime 
      };
    });
  } catch (error) {
    // If Firestore fails, log error but allow request (fail open)
    // This prevents rate limiting from breaking the app
    console.error('Rate limiting error (allowing request):', error);
    return { 
      allowed: true, 
      remaining: max - 1, 
      resetTime: Date.now() + windowMs 
    };
  }
};