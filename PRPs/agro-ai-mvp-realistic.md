# Product Requirements Prompt: AGRO AI Itinerary Builder (Realistic MVP)

## Summary

Build a simple, cost-effective web application that helps users discover agricultural producers in Eastern Ontario and create basic itineraries. Focus on delivering core value for the August event within the $1,000 budget constraint.

## MVP Scope (What We're Actually Building)

### Core Features Only
1. **Producer Directory**: Browse 26 agricultural producers
2. **Basic Filtering**: By category and region
3. **Simple Map**: Show producer locations
4. **Manual Itinerary Builder**: Select 3-4 producers
5. **Share Functionality**: Via URL

### Explicitly NOT in MVP
- AI-powered recommendations
- Offline sync
- User accounts
- Push notifications
- PDF export
- Native app features

## Environment Setup (Simplified)

### Dependencies
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.22.0",
    "leaflet": "^1.9.4",
    "react-leaflet": "^4.2.1",
    "lucide-react": "^0.323.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.55",
    "@types/react-dom": "^18.2.19",
    "@types/leaflet": "^1.9.8",
    "@vitejs/plugin-react": "^4.2.1",
    "typescript": "^5.3.3",
    "vite": "^5.1.0",
    "tailwindcss": "^3.4.1",
    "autoprefixer": "^10.4.17",
    "postcss": "^8.4.35"
  }
}
```

### Project Structure (Minimal)
```
agro-ai-itinerary-builder/
├── public/
│   ├── data/
│   │   └── producers.json      # Static producer data
│   └── images/
│       └── producers/          # Optimized images
├── src/
│   ├── components/
│   │   ├── Layout.tsx
│   │   ├── ProducerCard.tsx
│   │   ├── ProducerList.tsx
│   │   ├── FilterBar.tsx
│   │   ├── MapView.tsx
│   │   └── ItineraryBuilder.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Producers.tsx
│   │   ├── ProducerDetail.tsx
│   │   └── Itinerary.tsx
│   ├── hooks/
│   │   ├── useProducers.ts
│   │   └── useItinerary.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   ├── distance.ts
│   │   └── share.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

## Data Structure (Simplified)

### Producer Data (Static JSON)
```typescript
interface Producer {
  id: string;
  name: string;
  description: string; // 2-3 sentences max
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  categories: string[]; // "vegetables", "fruits", "dairy", etc.
  activities: string[]; // "farm-store", "pick-your-own"
  hours: string; // Simple text: "Daily 9am-5pm" or "Weekends only"
  phone?: string;
  website?: string;
  image: string; // Path to optimized image
  seasonal: string; // "Year-round" or "May-October"
}
```

## Implementation Plan (4 Weeks)

### Week 1: Foundation
- [ ] Set up Vite + React + TypeScript
- [ ] Configure Tailwind CSS
- [ ] Create basic layout and routing
- [ ] Design mobile-first UI components
- [ ] Prepare producer data JSON
- [ ] Optimize producer images (< 100KB each)

### Week 2: Core Features
- [ ] Build producer list with cards
- [ ] Implement category filters
- [ ] Create producer detail pages
- [ ] Add search functionality
- [ ] Build responsive grid/list toggle
- [ ] Implement data loading from JSON

### Week 3: Map & Location
- [ ] Integrate Leaflet map
- [ ] Add producer markers
- [ ] Implement user location (optional)
- [ ] Calculate distances
- [ ] Create "Get Directions" links (Google Maps)
- [ ] Add map/list view toggle

### Week 4: Itinerary & Polish
- [ ] Build itinerary selector (checkbox UI)
- [ ] Create itinerary summary page
- [ ] Implement share via URL parameters
- [ ] Add loading states
- [ ] Fix responsive issues
- [ ] Deploy to GitHub Pages

## Technical Decisions

### Why These Choices
- **Leaflet over Mapbox**: Free, no API limits
- **Static JSON over API**: No backend costs, instant loading
- **GitHub Pages**: Free hosting with custom domain
- **No State Management**: Simple React state is enough
- **No PWA Initially**: Add after MVP success
- **URL Parameters for Sharing**: Simple, no backend needed

### Code Examples

#### Simple Distance Calculation
```typescript
export const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Math.round(R * c);
};
```

#### URL-based Sharing
```typescript
export const createShareUrl = (producerIds: string[]): string => {
  const params = new URLSearchParams({
    stops: producerIds.join(','),
    v: '1'
  });
  return `${window.location.origin}/itinerary?${params}`;
};
```

## Deployment Strategy

### GitHub Pages Setup
```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### Custom Domain
1. Add CNAME file with domain
2. Configure DNS with GitHub IPs
3. Enable HTTPS in repo settings

## Success Metrics

### Launch Day (August Event)
- [ ] Site loads in < 3 seconds
- [ ] All 26 producers displayed
- [ ] Map works on mobile
- [ ] Can create and share itinerary
- [ ] No critical bugs

### Week 1 Post-Launch
- [ ] 500+ unique visitors
- [ ] 50+ itineraries created
- [ ] < 5% bounce rate
- [ ] Positive user feedback
- [ ] Producer data accurate

### Month 1
- [ ] 2,000+ users
- [ ] Identify top 3 feature requests
- [ ] Plan Phase 2 based on usage
- [ ] Secure additional funding if needed

## Risk Management

### Technical Risks
- **Image Loading**: Lazy load, optimize aggressively
- **Map Performance**: Cluster markers if needed
- **Mobile Data**: Keep bundle under 500KB
- **Browser Support**: Test on iOS Safari

### Content Risks
- **Data Accuracy**: Verify with each producer
- **Image Rights**: Get permission or use own photos
- **Updates**: Plan monthly review process

## Post-MVP Roadmap

Only after MVP success and additional funding:

### Phase 2 (Month 2-3)
- Basic PWA features
- Improved filtering
- Save favorites locally
- Basic analytics

### Phase 3 (Month 4-6)
- Backend API
- AI recommendations
- User accounts
- Producer portal

### Phase 4 (Year 2)
- Native apps
- Booking integration
- Multi-region support
- Revenue model

## Budget Breakdown

### Development Costs
- $0 - Open source tools
- $0 - GitHub Pages hosting
- $50 - Domain registration
- $100 - Stock photos/graphics
- **Subtotal: $150**

### Marketing/Launch
- $200 - Social media ads
- $150 - Print materials
- $100 - Launch event costs
- **Subtotal: $450**

### Operations (Year 1)
- $50 - Domain renewal
- $200 - Contingency
- $150 - Updates/maintenance
- **Subtotal: $400**

**Total: $1,000**

## Final Notes

### What Makes This Realistic
1. **Proven Tech**: No experimental features
2. **Static First**: No ongoing API costs
3. **Progressive**: Can enhance later
4. **Focused**: Does one thing well
5. **Sustainable**: Can hand off easily

### Keys to Success
1. **Data Quality**: Verify every producer
2. **Mobile First**: Test extensively
3. **Fast Loading**: Optimize everything
4. **Simple UX**: Grandma-friendly
5. **Real Feedback**: Listen to users

---
**Version**: 2.0 (Realistic MVP)
**Created**: January 8, 2025
**Budget**: $1,000 CAD (achievable)
**Timeline**: 4 weeks (doable)