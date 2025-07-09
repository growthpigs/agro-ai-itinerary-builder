import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Clock, Phone, Globe, Mail, ArrowLeft, Plus, Check } from 'lucide-react';
import type { Producer } from '@/types';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { CATEGORY_LABELS, ACTIVITY_LABELS } from '@/types';

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
          <Link
            to="/producers"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Back to producers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Image */}
      <div className="relative h-64 sm:h-96 bg-gray-200">
        <img
          src={producer.image}
          alt={producer.name}
          className="w-full h-full object-cover"
        />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{producer.name}</h1>
              {producer.featured && (
                <span className="inline-block bg-primary-600 text-white text-sm px-3 py-1 rounded-full">
                  Featured Producer
                </span>
              )}
            </div>
            <button
              onClick={handleAddToItinerary}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors',
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

          {/* Description */}
          <p className="text-gray-600 mb-6">{producer.description}</p>

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
                <a
                  href={`https://maps.google.com/?q=${producer.location.lat},${producer.location.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 text-sm"
                >
                  Get directions
                </a>
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
                  <a
                    href={`tel:${producer.phone}`}
                    className="flex items-center gap-3 text-gray-600 hover:text-primary-600"
                  >
                    <Phone className="h-5 w-5" />
                    <span>{producer.phone}</span>
                  </a>
                )}
                {producer.email && (
                  <a
                    href={`mailto:${producer.email}`}
                    className="flex items-center gap-3 text-gray-600 hover:text-primary-600"
                  >
                    <Mail className="h-5 w-5" />
                    <span>{producer.email}</span>
                  </a>
                )}
                {producer.website && (
                  <a
                    href={producer.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-gray-600 hover:text-primary-600"
                  >
                    <Globe className="h-5 w-5" />
                    <span>Visit website</span>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8">
          <Link
            to="/producers"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            ← Back to all producers
          </Link>
        </div>
      </div>
    </div>
  );
};

function cn(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}