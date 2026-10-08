# Offline Caching Implementation

This document explains how offline caching and state persistence has been implemented in the Plexus Medical App.

## Overview

The application now supports offline functionality through:
1. **State Persistence**: Application state is saved to localStorage
2. **Service Worker**: Caches static assets and API responses for offline access
3. **Offline Detection**: Visual indicator when the user is offline
4. **Automatic State Recovery**: State is automatically restored when the app reloads

## Components

### 1. State Persistence (`src/utils/storage.ts`)

Provides utilities for saving and loading application state:

- **AppContext State**: Cases, user progress, and recent diagnoses are persisted
- **Case-Specific State**: Chat history, investigations, and differential diagnoses for each case
- **Offline Queue**: Actions that fail due to network issues can be queued for retry

**Key Functions:**
- `saveAppState()` / `loadAppState()` - Persist global app state
- `saveCaseState()` / `loadCaseState()` - Persist case-specific state
- `addToOfflineQueue()` / `getOfflineQueue()` - Manage offline action queue

### 2. Service Worker (`public/sw.js`)

Implements caching strategies for offline support:

- **Static Assets**: Cache-first strategy for HTML, CSS, JS, and images
- **API Responses**: Network-first strategy with cache fallback
- **Cache Management**: Automatic cleanup of old caches on update

**Caching Strategies:**
- **Cache-First**: Used for static assets (HTML, CSS, images)
- **Network-First**: Used for API calls (tries network, falls back to cache)

### 3. Offline Detection (`src/utils/offline.ts`)

Utilities for detecting and handling offline status:

- `isOnline()` - Check current online status
- `onOnlineStatusChange()` - Listen for online/offline events
- `registerServiceWorker()` - Register the service worker
- `unregisterServiceWorker()` - Unregister (useful for development)

### 4. Offline Indicator (`src/components/ui/OfflineIndicator.tsx`)

Visual component that shows when the user is offline:
- Displays a yellow banner at the top when offline
- Automatically hides when connection is restored
- Informs users that their work is being saved locally

## How It Works

### State Persistence Flow

1. **On State Change**: Whenever AppContext or CaseScreen state changes, it's automatically saved to localStorage
2. **On App Load**: When the app loads, it checks localStorage and restores the previous state
3. **On Case Load**: When a case is opened, its specific state (chat, investigations, etc.) is restored

### Service Worker Flow

1. **Installation**: Service worker is registered on app load (production only)
2. **Caching**: Static assets are cached on first load
3. **Fetch Interception**: All fetch requests are intercepted
   - Static assets: Served from cache if available
   - API calls: Try network first, fall back to cache if offline
4. **Updates**: When a new version is available, old caches are cleaned up

### Offline Behavior

When the user goes offline:
1. **Visual Feedback**: Offline indicator appears at the top
2. **State Saving**: All state changes continue to be saved locally
3. **API Calls**: API calls fail gracefully with error messages
4. **State Recovery**: When connection is restored, state is already saved and can be synced

## Usage

### For Users

- **No action required**: State is automatically saved and restored
- **Offline indicator**: Yellow banner shows when offline
- **Work continues**: You can continue working offline; state is saved locally
- **Automatic recovery**: When you reload the page, your previous state is restored

### For Developers

#### Testing Offline Mode

1. **Chrome DevTools**:
   - Open DevTools → Network tab
   - Check "Offline" checkbox
   - Reload the page

2. **Service Worker**:
   - DevTools → Application → Service Workers
   - View registered service workers
   - Test update/activation

3. **Cache Inspection**:
   - DevTools → Application → Cache Storage
   - View cached assets and responses

#### Clearing Cached State

```javascript
// Clear all app state
localStorage.clear();

// Clear specific case state
import { clearCaseState } from './src/utils/storage';
clearCaseState('case-id-here');
```

#### Disabling Service Worker (Development)

The service worker only registers in production builds. For development:
- Service worker is not registered (avoids caching issues during development)
- State persistence still works (useful for testing)

## Limitations

1. **API Calls**: Cannot generate new cases or get AI responses when offline
2. **Authentication**: Requires initial online connection for Firebase auth
3. **Storage Limits**: localStorage has size limits (~5-10MB); very large states may not persist
4. **Browser Support**: Service workers require HTTPS (or localhost for development)

## Future Enhancements

Potential improvements:
- IndexedDB for larger storage capacity
- Background sync for queued actions
- Push notifications for sync completion
- Conflict resolution for concurrent edits
- Partial offline support for AI features (cached responses)

## Files Modified/Created

### New Files
- `src/utils/storage.ts` - State persistence utilities
- `src/utils/offline.ts` - Offline detection utilities
- `src/components/ui/OfflineIndicator.tsx` - Offline indicator component
- `public/sw.js` - Service worker implementation
- `OFFLINE_CACHING.md` - This documentation

### Modified Files
- `src/context/AppContext.tsx` - Added state persistence
- `src/components/screens/CaseScreen.tsx` - Added case state persistence
- `App.tsx` - Added offline indicator
- `index.tsx` - Added service worker registration
- `manifest.json` - Enhanced PWA configuration

## Testing Checklist

- [x] State persists on page reload
- [x] Case state (chat, investigations, DDx) persists
- [x] Offline indicator shows/hides correctly
- [x] Service worker caches static assets
- [x] Service worker handles API requests offline
- [x] State recovery works after offline period
- [x] No errors in console during offline mode
