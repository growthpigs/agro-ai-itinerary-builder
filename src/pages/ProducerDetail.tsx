import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Clock, Phone, Globe, Mail, ArrowLeft, Plus, Check } from 'lucide-react';
import type { Producer } from '@/types';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { CATEGORY_LABELS, ACTIVITY_LABELS } from '@/types';
import { ProducerImage } from '@/components/ui/ProducerImage';
import { SafeLink } from '@/components/ui/SafeLink';
import { producerDescriptions } from '@/data/producerDescriptions';
import { useAnalytics } from '@/hooks/useAnalytics';

export const ProducerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { trackProducerViewed } = useAnalytics();
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
          // Track producer view
          trackProducerViewed(found);
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
    <div className="min-h-screen bg-gray-50">
      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </button>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8">
          {/* Header with thumbnail */}
          <div className="flex items-start gap-6 mb-6">
            {/* Producer thumbnail */}
            <div className="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden">
              <ProducerImage
                producerSlug={producer.id}
                alt={producer.name}
                size="medium"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Header content */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="min-w-0">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 leading-tight">{producer.name}</h1>
                  {producer.featured && (
                    <span className="inline-block bg-primary-600 text-white text-sm px-3 py-1 rounded-full">
                      Featured Producer
                    </span>
                  )}
                </div>
                <button
                  onClick={handleAddToItinerary}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors flex-shrink-0',
                    inItinerary
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-primary-600 text-white hover:bg-primary-700'
                  )}
                >
                  {inItinerary ? (
                    <>
                      <Check className="h-5 w-5" />
                      In Itinerary
                    </>
                  ) : (
                    <>
                      <Plus className="h-5 w-5" />
                      Add to Itinerary
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="text-gray-600 mb-6">
            <p className="font-medium mb-2">{producer.description}</p>
            {producerDescriptions[producer.id] && (
              <div className="mt-4 space-y-4">
                {producerDescriptions[producer.id].trim().split('\n\n').map((paragraph, index) => (
                  <p key={index} className="leading-relaxed">
                    {paragraph.trim()}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* Image Gallery - 2x2 on mobile, 1x4 on desktop */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Gallery</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((num) => {
                // Simple approach: use producer.id + image number
                const imageSlug = `${producer.id}-${num}`;
                
                console.log('[ProducerDetail Gallery Debug]', {
                  producerId: producer.id,
                  imageNumber: num,
                  finalSlug: imageSlug
                });
                
                return (
                  <div 
                    key={num}
                    className="aspect-square rounded-lg overflow-hidden bg-gray-100"
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

          {/* Categories & Activities */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Products</h3>
              <div className="flex flex-wrap gap-2">
                {producer.categories.map((category) => (
                  <span
                    key={category}
                    className="bg-primary-100 text-primary-700 text-sm px-3 py-1 rounded-full"
                  >
                    {CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS] || category}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Activities</h3>
              <div className="flex flex-wrap gap-2">
                {producer.activities.map((activity) => (
                  <span
                    key={activity}
                    className="bg-earth-100 text-earth-700 text-sm px-3 py-1 rounded-full"
                  >
                    {ACTIVITY_LABELS[activity as keyof typeof ACTIVITY_LABELS] || activity}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="border-t border-gray-200 pt-6 space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Location</p>
                <p className="text-gray-600">{producer.location.address}</p>
                <SafeLink
                  href={producer.location?.lat && producer.location?.lng ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(producer.location.address)}&destination_place_id=&center=${producer.location.lat},${producer.location.lng}&travelmode=driving` : null}
                  type="external"
                  className="text-primary-600 hover:text-primary-700 text-sm"
                  producerName={producer.name}
                  linkLabel="get-directions"
                  disabledMessage="Location coordinates unavailable"
                >
                  Get directions
                </SafeLink>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Hours</p>
                <p className="text-gray-600">{producer.hours}</p>
                <p className="text-sm text-gray-500">Season: {producer.seasonal}</p>
              </div>
            </div>

            {/* Contact Info */}
            {(producer.phone || producer.email || producer.website) && (
              <div className="border-t border-gray-200 pt-4 space-y-3">
                {producer.phone && (
                  <SafeLink
                    href={producer.phone}
                    type="phone"
                    className="flex items-center gap-3 text-gray-600 hover:text-primary-600"
                    producerName={producer.name}
                    linkLabel="phone-detail"
                    disabledMessage="Invalid phone number"
                  >
                    <Phone className="h-5 w-5" />
                    <span>{producer.phone}</span>
                  </SafeLink>
                )}
                {producer.email && (
                  <SafeLink
                    href={producer.email}
                    type="email"
                    className="flex items-center gap-3 text-gray-600 hover:text-primary-600"
                    producerName={producer.name}
                    linkLabel="email-detail"
                    disabledMessage="Invalid email address"
                  >
                    <Mail className="h-5 w-5" />
                    <span>{producer.email}</span>
                  </SafeLink>
                )}
                {producer.website && (
                  <SafeLink
                    href={producer.website}
                    type="external"
                    className="flex items-center gap-3 text-gray-600 hover:text-primary-600"
                    producerName={producer.name}
                    linkLabel="website-detail"
                    disabledMessage="Invalid website URL"
                  >
                    <Globe className="h-5 w-5" />
                    <span>Visit website</span>
                  </SafeLink>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8">
          <SafeLink
            href="/producers"
            type="internal"
            className="text-primary-600 hover:text-primary-700 font-medium"
            producerName="ProducerDetail"
            linkLabel="back-to-all-producers"
          >
            ← Back to all producers
          </SafeLink>
        </div>
      </div>
    </div>
  );
};

function cn(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}