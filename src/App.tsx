import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Producers } from './pages/Producers';
import { ProducerDetail } from './pages/ProducerDetail';
import { Itinerary } from './pages/Itinerary';
import { ItineraryBuilder } from './pages/ItineraryBuilder';
import { About } from './pages/About';
import { ItineraryProvider } from './contexts/ItineraryContext';

function App() {
  console.log('[APP] Component rendering...');
  console.log('[APP] React version:', React.version);
  
  // DIAGNOSTIC: Track component lifecycle
  React.useEffect(() => {
    console.log('[APP] App component mounted');
    return () => console.log('[APP] App component unmounting');
  }, []);
  
  return (
    <BrowserRouter>
      <ItineraryProvider>
        <Layout>
          <Routes>
            <Route path="/" element={
              <React.Suspense fallback={<div>Loading ItineraryBuilder...</div>}>
                <ItineraryBuilder />
              </React.Suspense>
            } />
            <Route path="/home" element={<Home />} />
            <Route path="/producers" element={<Producers />} />
            <Route path="/producer/:id" element={<ProducerDetail />} />
            <Route path="/itinerary" element={<Itinerary />} />
            <Route path="/itinerary/create" element={<Producers />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </Layout>
      </ItineraryProvider>
    </BrowserRouter>
  );
}

export default App;