## FEATURE:

AGRO AI Itinerary Builder - A Progressive Web App (PWA) that generates personalized, GPS-enabled loop itineraries featuring 3-4 agricultural producer stops in Eastern Ontario, Canada. The app uses AI to match user preferences with producer offerings and creates optimal routes for agricultural tourism.

## EXAMPLES:

### User Flow Example:
1. User opens PWA on mobile device
2. App requests location permission (or allows manual location input)
3. User selects preferences:
   - Product interests (vegetables, fruits, dairy, meat, etc.)
   - Activities (farm tours, pick-your-own, farm stores)
   - Accessibility needs
   - Time available for tour
4. AI generates personalized itinerary with 3-4 stops
5. User views route on interactive map
6. User can share itinerary or export to navigation apps

### Producer Data Example:
```json
{
  "id": "farm-001",
  "name": "Sunshine Valley Farm",
  "description": "Family-owned organic vegetable farm with u-pick strawberries",
  "location": {
    "lat": 45.4215,
    "lng": -75.6972,
    "address": "123 Farm Road, Ottawa, ON K1A 0B1"
  },
  "categories": ["vegetables", "fruits"],
  "activities": ["farm-store", "pick-your-own"],
  "hours": {
    "monday": "9:00-17:00",
    "tuesday": "9:00-17:00"
  }
}
```

### AI Prompt Example for Itinerary Generation:
```
Based on user preferences for [vegetable farms, pick-your-own activities, wheelchair accessible], 
starting from [user location], create an optimal loop route visiting 3-4 producers from the 
available list. Consider: driving distance (max 2 hours total), seasonal availability 
(current date: August), operating hours, and diversity of experiences.
```

## DOCUMENTATION:

### Technology Stack:
- React with TypeScript: https://react.dev/learn/typescript
- Vite PWA Plugin: https://vite-pwa-org.netlify.app/
- Tailwind CSS: https://tailwindcss.com/docs
- shadcn/ui: https://ui.shadcn.com/docs
- Mapbox GL JS: https://docs.mapbox.com/mapbox-gl-js/
- OpenAI API: https://platform.openai.com/docs/

### PWA Requirements:
- Service Worker for offline functionality
- Web App Manifest for installability
- HTTPS deployment requirement
- Responsive design for mobile-first approach
- Cache strategies for producer data and images

### Data Sources:
- Initial dataset of 26 agricultural producers in Eastern Ontario
- Producer information includes: location, products, activities, hours, accessibility
- Seasonal availability data for different products

## OTHER CONSIDERATIONS:

### Budget Constraints:
- Total budget: $1,000 CAD (potential additional $500-1,000)
- Must use free tier services where possible
- Consider costs for: hosting, maps API, OpenAI API calls

### Timeline:
- Working prototype needed ASAP
- Event deadline: Late August
- Long-term usage planned (3+ years)

### Performance Requirements:
- Fast initial load (<3 seconds)
- Offline functionality for saved itineraries
- Minimal data usage for rural areas
- Lighthouse PWA score: 90+

### Privacy & Security:
- No personal data storage without consent
- Anonymous usage analytics only
- PIPEDA compliance (Canadian privacy law)
- Secure API key management

### User Experience:
- Mobile-first design (most users on phones)
- Large touch targets for outdoor use
- High contrast for sunlight visibility
- Simple, intuitive navigation
- Bilingual support (future consideration)

### Technical Gotchas:
- GPS accuracy in rural areas may vary
- Some farms have limited cell coverage
- PWA installation prompts vary by browser
- iOS has limited PWA support compared to Android
- Map tiles need offline caching strategy

### Scaling Considerations:
- Initial 26 producers, plan for 100+
- Producer self-service portal (future feature)
- Multi-region support (future expansion)
- API rate limiting for free tiers