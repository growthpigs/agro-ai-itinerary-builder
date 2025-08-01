import { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Producers } from './pages/Producers';
import { ProducerDetail } from './pages/ProducerDetail';
import { Itinerary } from './pages/Itinerary';
import { ItineraryBuilder } from './pages/ItineraryBuilder';
import { ActiveItinerary } from './pages/ActiveItinerary';
import { Categories } from './pages/Categories';
import { About } from './pages/About';
import { ItineraryProvider } from './contexts/ItineraryContext';
import { LocationProvider } from './contexts/LocationContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ScrollToTop } from './components/ScrollToTop';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ScrollToTop />
        <LocationProvider>
          <ItineraryProvider>
            <Layout>
              <Routes>
                <Route path="/" element={
                  <Suspense fallback={<div>Loading ItineraryBuilder...</div>}>
                    <ItineraryBuilder />
                  </Suspense>
                } />
                <Route path="/home" element={<Home />} />
                <Route path="/producers" element={<Producers />} />
                <Route path="/producer/:id" element={<ProducerDetail />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/itinerary" element={<Itinerary />} />
                <Route path="/active-itinerary" element={<ActiveItinerary />} />
                <Route path="/itinerary/create" element={<Producers />} />
                <Route path="/about" element={<About />} />
              </Routes>
            </Layout>
          </ItineraryProvider>
        </LocationProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;