import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Clock, Phone, Globe, Mail, ArrowLeft, Plus, Check } from 'lucide-react';
import type { Producer } from '@/types';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { CATEGORY_LABELS, ACTIVITY_LABELS } from '@/types';
import { ProducerImage } from '@/components/ui/ProducerImage';
import { SafeLink } from '@/components/ui/SafeLink';
import { producerDescriptions } from '@/data/producerDescriptions';

export const ProducerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [producer, setProducer] = useState<Producer | null>(null);
  const [loading, setLoading] = useState(true);
  const [inItinerary, setInItinerary] = useState(false);

  useEffect(() => {
    const loadProducer = async () => {
      try {
        const response = await fetch('/data/producers.json');
        const data = await response.json();
        const found = data.producers.find((p: Producer) => p.id === id);
        
        if (found) {
          setProducer(found);
          // Check if producer is in itinerary (would be in real app state)
          const savedItinerary = localStorage.getItem('itinerary');
          if (savedItinerary) {
            const itinerary = JSON.parse(savedItinerary);
            setInItinerary(itinerary.includes(found.id));
          }
        }
      } catch (error) {
        console.error('Failed to load producer:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducer();
  }, [id]);

  const handleAddToItinerary = () => {
    if (!producer) return;

    const savedItinerary = localStorage.getItem('itinerary');
    const itinerary = savedItinerary ? JSON.parse(savedItinerary) : [];
    
    if (inItinerary) {
      // Remove from itinerary
      const updated = itinerary.filter((pid: string) => pid !== producer.id);
      localStorage.setItem('itinerary', JSON.stringify(updated));
      setInItinerary(false);
    } else {
      // Add to itinerary
      const updated = [...itinerary, producer.id];
      localStorage.setItem('itinerary', JSON.stringify(updated));
      setInItinerary(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!producer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Producer not found</p>
          <SafeLink
            href="/producers"
            type="internal"
            className="text-primary-600 hover:text-primary-700 font-medium"
            producerName="ProducerDetail"
            linkLabel="back-to-producers-error"
          >
            Back to producers
          </SafeLink>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Full Width Banner - Breaking out of container */}
      <header className="relative -mx-4 sm:-mx-6 lg:-mx-8">
        <div className="relative w-full h-[45vh] max-h-[400px] overflow-hidden bg-gray-200">
          <ProducerImage
            producerSlug={producer.id + '-1'}
            alt={`${producer.name} banner`}
            size="full"
            className="absolute inset-0 w-full h-full object-cover object-center"
            loading="eager"
          />
          
          {/* White gradient overlay with opacity */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/40 to-white/20" />
          
          {/* Benday dot pattern overlay */}
          <div 
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)`,
              backgroundSize: '4px 4px',
              backgroundPosition: '0 0, 2px 2px'
            }}
          />
          
          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 sm:left-6 lg:left-8 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-all hover:scale-105 shadow-lg"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Content - Better width for readability */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Producer Header Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 -mt-12 relative z-10 overflow-hidden">
          {/* Header with Image and Title */}
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Producer Thumbnail */}
              <div className="flex-shrink-0">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden shadow-md">
                  <ProducerImage
                    producerSlug={producer.id}
                    alt={producer.name}
                    size="thumb"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              {/* Title and Quick Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">{producer.name}</h1>
                    {producer.featured && (
                      <span className="inline-block mt-2 bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
                        Featured Producer
                      </span>
                    )}
                  </div>
                  <button
                    onClick={handleAddToItinerary}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap',
                      inItinerary
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-primary-600 text-white hover:bg-primary-700 hover:scale-105'
                    )}
                  >
                    {inItinerary ? (
                      <>
                        <Check className="h-4 w-4" />
                        In Itinerary
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        Add to Itinerary
                      </>
                    )}
                  </button>
                </div>
                <p className="mt-3 text-gray-600 font-medium">{producer.description}</p>
              </div>
            </div>

            {/* Concise Description - 2 short paragraphs max */}
            {producerDescriptions[producer.id] && (
              <div className="mt-6 space-y-3 text-gray-600 leading-relaxed">
                {producerDescriptions[producer.id]
                  .trim()
                  .split('\n\n')
                  .slice(0, 2)
                  .map((paragraph, index) => {
                    // Limit each paragraph to ~150 characters for better readability
                    const shortened = paragraph.trim().length > 150 
                      ? paragraph.trim().substring(0, paragraph.trim().lastIndexOf(' ', 150)) + '...'
                      : paragraph.trim();
                    
                    return (
                      <p key={index} className="text-sm sm:text-base">
                        {shortened}
                      </p>
                    );
                  })}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 mt-6 mb-6" />
          
          {/* Fact Grid with proper padding */}
          <div className="bg-gray-50 rounded-lg p-6 grid sm:grid-cols-2 gap-6 text-sm">
            {/* Location */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary-600" />
                Location
              </h3>
              <p className="text-gray-600">{producer.location.address}</p>
              <SafeLink
                href={producer.location?.lat && producer.location?.lng ? `https://maps.google.com/?q=${producer.location.lat},${producer.location.lng}` : null}
                type="external"
                className="text-primary-600 hover:text-primary-700 text-sm inline-flex items-center gap-1 mt-1"
                producerName={producer.name}
                linkLabel="get-directions"
                disabledMessage="Location coordinates unavailable"
              >
                Get directions →
              </SafeLink>
            </div>
            
            {/* Hours */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary-600" />
                Hours & Season
              </h3>
              <p className="text-gray-600">{producer.hours}</p>
              <p className="text-gray-500 text-sm mt-1">{producer.seasonal}</p>
            </div>
            
            {/* Contact */}
            {(producer.phone || producer.email || producer.website) && (
              <div className="sm:col-span-2">
                <h3 className="font-semibold text-gray-900 mb-2">Contact</h3>
                <div className="space-y-2">
                  {producer.phone && (
                    <SafeLink
                      href={producer.phone}
                      type="phone"
                      className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors"
                      producerName={producer.name}
                      linkLabel="phone-detail"
                      disabledMessage="Invalid phone number"
                    >
                      <Phone className="h-4 w-4" />
                      <span>{producer.phone}</span>
                    </SafeLink>
                  )}
                  {producer.email && (
                    <SafeLink
                      href={producer.email}
                      type="email"
                      className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors"
                      producerName={producer.name}
                      linkLabel="email-detail"
                      disabledMessage="Invalid email address"
                    >
                      <Mail className="h-4 w-4" />
                      <span>{producer.email}</span>
                    </SafeLink>
                  )}
                  {producer.website && (
                    <SafeLink
                      href={producer.website}
                      type="external"
                      className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors"
                      producerName={producer.name}
                      linkLabel="website-detail"
                      disabledMessage="Invalid website URL"
                    >
                      <Globe className="h-4 w-4" />
                      <span>Visit website</span>
                    </SafeLink>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Categories & Activities */}
          <div className="border-t border-gray-100 mt-6 pt-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm uppercase tracking-wide">Products</h3>
                <div className="flex flex-wrap gap-2">
                  {producer.categories.map((category) => (
                    <span
                      key={category}
                      className="bg-primary-50 text-primary-700 text-xs px-2.5 py-1 rounded-full font-medium"
                    >
                      {CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS] || category}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm uppercase tracking-wide">Activities</h3>
                <div className="flex flex-wrap gap-2">
                  {producer.activities.map((activity) => (
                    <span
                      key={activity}
                      className="bg-earth-50 text-earth-700 text-xs px-2.5 py-1 rounded-full font-medium"
                    >
                      {ACTIVITY_LABELS[activity as keyof typeof ACTIVITY_LABELS] || activity}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Image Gallery */}
        <div className="mt-6">
          <h3 className="font-semibold text-gray-900 mb-3">Gallery</h3>
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((num) => {
              const imageSlug = `${producer.id}-${num}`;
              
              return (
                <div 
                  key={num}
                  className="aspect-square rounded-lg overflow-hidden bg-gray-100 shadow-sm"
                >
                  <ProducerImage
                    producerSlug={imageSlug}
                    alt={`${producer.name} - Image ${num}`}
                    size="medium"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8 pb-8">
          <SafeLink
            href="/producers"
            type="internal"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
            producerName="ProducerDetail"
            linkLabel="back-to-all-producers"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all producers
          </SafeLink>
        </div>
      </div>
    </div>
  );
};

function cn(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}