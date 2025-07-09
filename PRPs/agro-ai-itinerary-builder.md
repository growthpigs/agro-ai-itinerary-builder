# Product Requirements Prompt: AGRO AI Itinerary Builder PWA

## Summary

Build a Progressive Web App (PWA) that generates personalized, GPS-enabled agricultural tourism itineraries for Eastern Ontario. The app will showcase 26 local producers, creating optimal 3-4 stop loop routes based on user preferences, location, and seasonal availability. This MVP must be production-ready for an August event while supporting long-term regional tourism promotion.

## Environment Setup

### Dependencies
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.22.0",
    "mapbox-gl": "^3.1.2",
    "openai": "^4.28.0",
    "zustand": "^4.5.0",
    "axios": "^1.6.7",
    "lucide-react": "^0.323.0",
    "date-fns": "^3.3.1",
    "react-hook-form": "^7.49.3",
    "zod": "^3.22.4",
    "@tanstack/react-query": "^5.18.1"
  },
  "devDependencies": {
    "@types/react": "^18.2.55",
    "@types/react-dom": "^18.2.19",
    "@vitejs/plugin-react": "^4.2.1",
    "@vitejs/plugin-pwa": "^0.17.5",
    "typescript": "^5.3.3",
    "vite": "^5.1.0",
    "tailwindcss": "^3.4.1",
    "autoprefixer": "^10.4.17",
    "postcss": "^8.4.35",
    "@testing-library/react": "^14.2.1",
    "@testing-library/user-event": "^14.5.2",
    "vitest": "^1.2.2",
    "eslint": "^8.56.0",
    "@typescript-eslint/parser": "^6.21.0",
    "@typescript-eslint/eslint-plugin": "^6.21.0"
  }
}
```

### Configuration Files

#### vite.config.ts
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'AGRO AI Itinerary Builder',
        short_name: 'AGRO AI',
        description: 'Discover Eastern Ontario agricultural producers',
        theme_color: '#047857',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,json}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.mapbox\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'mapbox-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
```

#### Environment Variables (.env)
```
VITE_MAPBOX_ACCESS_TOKEN=your_mapbox_token
VITE_OPENAI_API_KEY=your_openai_key
VITE_GOOGLE_PLACES_API_KEY=your_google_places_key
VITE_APP_URL=https://agro-ai.vercel.app
```

## Core Principles

1. **Mobile-First Design**: Every interface element must be optimized for touch interaction and outdoor visibility
2. **Offline Resilience**: Core functionality must work without internet connectivity
3. **Performance Optimization**: Initial load under 3 seconds, smooth 60fps interactions
4. **Accessibility Compliance**: WCAG 2.1 AA standards for all interactive elements
5. **Privacy First**: No personal data collection without explicit consent
6. **Progressive Enhancement**: Basic functionality works on all devices, enhanced features for capable browsers

## Primary Goals

1. **MVP for August Event**: Fully functional app with core features ready for late August agricultural showcase
2. **Seamless User Experience**: From location detection to itinerary generation in under 30 seconds
3. **Producer Showcase**: Effectively highlight unique aspects of all 26 agricultural producers
4. **Long-term Viability**: Architecture supporting 3+ years of use with minimal maintenance
5. **Budget Conscious**: Stay within $1,000 CAD budget using free/low-cost services

## Success Criteria

- [ ] PWA scores 90+ on Lighthouse audit
- [ ] Generates personalized itineraries in <10 seconds
- [ ] Works offline after initial load
- [ ] Supports all 26 producers with rich data
- [ ] Mobile-responsive on all screen sizes
- [ ] Accessible to users with disabilities
- [ ] GPS routing integrates with native maps
- [ ] Share functionality works across platforms
- [ ] AI generates contextually relevant itineraries
- [ ] Zero critical security vulnerabilities
- [ ] Build size under 500KB (gzipped)
- [ ] 80% unit test coverage

## Documentation References

### API Documentation
- Mapbox GL JS: https://docs.mapbox.com/mapbox-gl-js/
- OpenAI API: https://platform.openai.com/docs/
- Geolocation API: https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API
- Service Worker API: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API

### Library Documentation
- React: https://react.dev/reference/react
- TypeScript: https://www.typescriptlang.org/docs/
- Tailwind CSS: https://tailwindcss.com/docs
- Vite PWA Plugin: https://vite-pwa-org.netlify.app/
- Zustand: https://docs.pmnd.rs/zustand/getting-started/introduction
- React Query: https://tanstack.com/query/latest

### PWA Resources
- PWA Checklist: https://web.dev/pwa-checklist/
- Workbox: https://developer.chrome.com/docs/workbox/
- Web App Manifest: https://web.dev/add-manifest/

## Codebase Structure

```
agro-ai-itinerary-builder/
├── public/
│   ├── icons/                    # PWA icons
│   ├── images/
│   │   └── producers/           # Producer images
│   ├── manifest.json            # PWA manifest
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Layout.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Navigation.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── ErrorBoundary.tsx
│   │   ├── map/
│   │   │   ├── MapView.tsx
│   │   │   ├── RouteOverlay.tsx
│   │   │   ├── ProducerMarker.tsx
│   │   │   └── LocationPin.tsx
│   │   ├── producer/
│   │   │   ├── ProducerCard.tsx
│   │   │   ├── ProducerList.tsx
│   │   │   ├── ProducerDetail.tsx
│   │   │   └── ProducerFilters.tsx
│   │   └── itinerary/
│   │       ├── ItineraryBuilder.tsx
│   │       ├── PreferencesForm.tsx
│   │       ├── ItineraryView.tsx
│   │       ├── ShareModal.tsx
│   │       └── ExportOptions.tsx
│   ├── hooks/
│   │   ├── useGeolocation.ts
│   │   ├── useItinerary.ts
│   │   ├── useProducers.ts
│   │   └── useOffline.ts
│   ├── lib/
│   │   ├── ai/
│   │   │   ├── itineraryGenerator.ts
│   │   │   └── openaiClient.ts
│   │   ├── geo/
│   │   │   ├── distance.ts
│   │   │   ├── routing.ts
│   │   │   └── mapbox.ts
│   │   └── data/
│   │       ├── producers.ts
│   │       └── storage.ts
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── BuildItinerary.tsx
│   │   ├── Producers.tsx
│   │   ├── ProducerDetail.tsx
│   │   └── About.tsx
│   ├── store/
│   │   ├── useAppStore.ts
│   │   └── slices/
│   │       ├── itinerary.ts
│   │       ├── preferences.ts
│   │       └── ui.ts
│   ├── styles/
│   │   └── globals.css
│   ├── types/
│   │   ├── producer.types.ts
│   │   ├── itinerary.types.ts
│   │   └── api.types.ts
│   ├── utils/
│   │   ├── constants.ts
│   │   ├── formatters.ts
│   │   └── validators.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

## Implementation Plan

### Phase 1: Foundation Setup (Priority: Critical)

#### 1.1 Project Initialization
- Initialize Vite React TypeScript project
- Configure Tailwind CSS with custom theme
- Set up path aliases and TypeScript config
- Install and configure all dependencies
- Create initial folder structure

#### 1.2 PWA Configuration
- Configure Vite PWA plugin
- Create web app manifest with icons
- Implement basic service worker
- Set up offline page fallback
- Configure workbox for asset caching

#### 1.3 Core Components Setup
- Create Layout component with responsive navigation
- Implement ErrorBoundary for error handling
- Build LoadingSpinner with skeleton screens
- Set up React Router with lazy loading
- Create base page components

### Phase 2: Data Layer (Priority: High)

#### 2.1 Producer Data Management
- Create TypeScript interfaces for all data types
- Build producer data JSON structure
- Implement data validation with Zod
- Create producer data access layer
- Set up React Query for data fetching

#### 2.2 State Management
- Configure Zustand store
- Create itinerary slice for trip management
- Implement preferences slice for user settings
- Add UI slice for app state
- Set up persistence with localStorage

#### 2.3 Offline Storage
- Implement IndexedDB for producer data
- Create offline queue for itinerary saves
- Build sync mechanism for online restoration
- Add version management for data updates
- Implement cache invalidation strategy

### Phase 3: Map Integration (Priority: High)

#### 3.1 Mapbox Setup
- Initialize Mapbox GL JS
- Create responsive map component
- Implement user location tracking
- Add producer markers with clustering
- Build custom map controls

#### 3.2 Route Visualization
- Implement route polyline rendering
- Add turn-by-turn directions
- Create distance/time calculations
- Build route optimization algorithm
- Add alternative route suggestions

#### 3.3 Interactive Features
- Implement marker click handlers
- Add producer popup cards
- Create route dragging functionality
- Build zoom to fit functionality
- Add map style switcher

### Phase 4: AI Integration (Priority: High)

#### 4.1 OpenAI Setup
- Configure OpenAI client with error handling
- Implement rate limiting and retry logic
- Create token usage monitoring
- Build fallback algorithm
- Add response caching

#### 4.2 Itinerary Generation
- Build preference analysis system
- Implement semantic producer matching
- Create route optimization with AI
- Add seasonal awareness
- Build explanation generation

#### 4.3 AI Safety
- Implement input sanitization
- Add output validation
- Create content filtering
- Build error recovery
- Add performance monitoring

### Phase 5: User Interface (Priority: Medium)

#### 5.1 Producer Showcase
- Build responsive producer cards
- Create detailed producer pages
- Implement image galleries
- Add operating hours display
- Build contact information cards

#### 5.2 Itinerary Builder Flow
- Create preference selection wizard
- Build location permission flow
- Implement loading states
- Add progress indicators
- Create success animations

#### 5.3 Mobile Optimizations
- Implement touch gestures
- Add haptic feedback
- Create swipe navigation
- Build pull-to-refresh
- Optimize for thumb reach

### Phase 6: Sharing & Export (Priority: Medium)

#### 6.1 Share Functionality
- Implement Web Share API
- Create shareable links
- Build QR code generation
- Add social media cards
- Create email templates

#### 6.2 Export Options
- Build PDF generation
- Create calendar exports
- Implement GPS file downloads
- Add print stylesheets
- Build native map app links

### Phase 7: Testing & Optimization (Priority: Critical)

#### 7.1 Testing Implementation
- Write unit tests for utilities
- Create component tests
- Build integration tests
- Add E2E test scenarios
- Implement visual regression tests

#### 7.2 Performance Optimization
- Implement code splitting
- Add lazy loading for images
- Optimize bundle size
- Create performance budgets
- Add monitoring analytics

#### 7.3 Accessibility Audit
- Test with screen readers
- Verify keyboard navigation
- Check color contrast
- Test with reduced motion
- Add ARIA labels

## Validation Gates

### Build Validation
```bash
# Development build
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Check TypeScript
npm run type-check

# Bundle size analysis
npm run analyze
```

### Test Validation
```bash
# Run all tests
npm test

# Unit tests only
npm run test:unit

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# Test coverage
npm run test:coverage
```

### Linting Validation
```bash
# ESLint check
npm run lint

# Fix linting issues
npm run lint:fix

# Format with Prettier
npm run format

# Check formatting
npm run format:check
```

### PWA Validation
```bash
# Lighthouse CI
npm run lighthouse

# PWA audit
npm run pwa:audit

# Service worker check
npm run sw:check
```

## Error Handling Patterns

### Network Errors
```typescript
// Implement exponential backoff
const fetchWithRetry = async (url: string, retries = 3): Promise<Response> => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response;
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }
  throw new Error('Max retries exceeded');
};
```

### Geolocation Errors
- Permission denied: Show manual location input
- Position unavailable: Use IP-based fallback
- Timeout: Increase timeout and retry
- Unknown error: Log and show generic message

### AI Generation Errors
- API limit exceeded: Use local algorithm
- Invalid response: Retry with adjusted prompt
- Timeout: Show partial results
- Service unavailable: Queue for later

### Offline Scenarios
- No connection: Serve from cache
- Partial connection: Priority queue requests
- Sync conflicts: Last write wins
- Storage full: Clear old data

## Performance Requirements

### Loading Performance
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1
- First Input Delay: < 100ms

### Runtime Performance
- 60fps scrolling and animations
- < 100ms response to user input
- < 50MB memory usage
- < 5% CPU usage when idle
- Efficient battery usage

### Network Performance
- < 500KB initial bundle
- < 50KB per route request
- Implement request caching
- Use WebP images
- Enable gzip compression

## Security Considerations

### API Security
- Store keys in environment variables
- Implement CORS properly
- Use HTTPS everywhere
- Add rate limiting
- Validate all inputs

### Data Security
- No PII collection without consent
- Encrypt sensitive data
- Implement CSP headers
- Sanitize user inputs
- Secure local storage

### PWA Security
- Implement secure service worker
- Validate cached responses
- Use SRI for external resources
- Regular dependency updates
- Security audit in CI/CD

## Notes and Gotchas

### Technical Considerations
- iOS PWA limitations: No push notifications, limited storage
- Mapbox free tier: 50k map loads/month
- OpenAI rate limits: Plan for 3 RPM on free tier
- Rural connectivity: Aggressive caching needed
- GPS accuracy: May vary in rural areas

### UX Considerations
- Outdoor visibility: High contrast required
- Touch targets: Minimum 44x44px
- Loading states: Show progress, not spinners
- Error messages: User-friendly, actionable
- Offline mode: Clear indicators

### Development Tips
- Use React.memo for expensive components
- Implement virtual scrolling for long lists
- Lazy load images with native loading
- Use CSS containment for performance
- Profile regularly with React DevTools

### Deployment Considerations
- Use Vercel for easy PWA hosting
- Enable HTTP/2 push
- Configure proper cache headers
- Set up monitoring (Sentry)
- Implement feature flags

## Implementation Priority Order

1. **Core PWA Shell** - Get offline-capable foundation working
2. **Producer Data Layer** - Enable basic browsing functionality  
3. **Map Integration** - Visual representation of producers
4. **Basic Itinerary Builder** - Manual selection functionality
5. **AI Enhancement** - Intelligent recommendations
6. **Sharing Features** - Social and export capabilities
7. **Polish & Optimization** - Performance and UX refinement

---

**Generated**: January 8, 2025
**Version**: 1.0.0
**Budget Remaining**: $1,000 CAD
**Timeline**: 4 weeks to MVP