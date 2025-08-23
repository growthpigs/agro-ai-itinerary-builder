import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ItineraryProvider } from './contexts/ItineraryContext';
import { LocationProvider } from './contexts/LocationContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ScrollToTop } from './components/ScrollToTop';
import { LoadingSpinner } from './components/LoadingSpinner';

// Lazy load all pages for code splitting
const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const Producers = lazy(() => import('./pages/Producers').then(m => ({ default: m.Producers })));
const ProducerDetail = lazy(() => import('./pages/ProducerDetail').then(m => ({ default: m.ProducerDetail })));
const Itinerary = lazy(() => import('./pages/Itinerary').then(m => ({ default: m.Itinerary })));
const ItineraryBuilder = lazy(() => import('./pages/ItineraryBuilder').then(m => ({ default: m.ItineraryBuilder })));
const ActiveItinerary = lazy(() => import('./pages/ActiveItinerary').then(m => ({ default: m.ActiveItinerary })));
const Categories = lazy(() => import('./pages/Categories').then(m => ({ default: m.Categories })));
const About = lazy(() => import('./pages/About').then(m => ({ default: m.About })));
const Admin = lazy(() => import('./pages/Admin').then(m => ({ default: m.Admin })));

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ScrollToTop />
        <LocationProvider>
          <ItineraryProvider>
            <Layout>
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  <Route path="/" element={<ItineraryBuilder />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/producers" element={<Producers />} />
                  {/* Redirect old Martine's Kitchen route to Brighter with Blooms */}
                  <Route path="/producer/martines-kitchen" element={<Navigate to="/producer/brighter-with-blooms" replace />} />
                  <Route path="/producer/:id" element={<ProducerDetail />} />
                  <Route path="/categories" element={<Categories />} />
                  <Route path="/itinerary" element={<Itinerary />} />
                  <Route path="/active-itinerary" element={<ActiveItinerary />} />
                  <Route path="/itinerary/create" element={<Producers />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/admin" element={<Admin />} />
                </Routes>
              </Suspense>
            </Layout>
          </ItineraryProvider>
        </LocationProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;