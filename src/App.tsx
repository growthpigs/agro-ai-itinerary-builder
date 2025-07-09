import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Producers } from './pages/Producers';
import { ProducerDetail } from './pages/ProducerDetail';
import { Itinerary } from './pages/Itinerary';
import { ItineraryBuilder } from './pages/ItineraryBuilder';
import { ActiveItinerary } from './pages/ActiveItinerary';
import { About } from './pages/About';
import CategoriesPage from './pages/Categories';
import { ItineraryProvider } from './contexts/ItineraryContext';
import { LocationProvider } from './contexts/LocationContext';
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <LocationProvider>
          <ItineraryProvider>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/producers" element={<Producers />} />
                <Route path="/producer/:id" element={<ProducerDetail />} />
                <Route path="/itinerary-builder" element={<ItineraryBuilder />} />
                <Route path="/itinerary" element={<Itinerary />} />
                <Route path="/active-itinerary" element={<ActiveItinerary />} />
                <Route path="/itinerary/create" element={<Producers />} />
                <Route path="/about" element={<About />} />
                <Route path="/categories" element={<CategoriesPage />} />
              </Routes>
            </Layout>
          </ItineraryProvider>
        </LocationProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;