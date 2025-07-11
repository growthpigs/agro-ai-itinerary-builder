import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ArrowRight, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ProducerImage } from '@/components/ui/ProducerImage';
import { useItinerary } from '@/hooks/useItinerary';
import { useLocation } from '@/contexts/LocationContext';
import { buildCategoryItinerary } from '@/services/categoryItinerary';
import type { Producer } from '@/types';

interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  keywords: string[];
}

const categories: Category[] = [
  {
    id: 'local-food',
    name: 'Local Food',
    description: 'Fresh produce, meats, and farm products',
    image: 'avonmore-berry-farm-4',
    keywords: ['local', 'food', 'produce', 'farm', 'fresh']
  },
  {
    id: 'wine-beer-spirits',
    name: 'Wine, Beer & Spirits',
    description: 'Wineries, breweries, and distilleries',
    image: 'vankleek-hill-vineyard-3',
    keywords: ['wine', 'beer', 'spirits', 'brewery', 'winery', 'vineyard']
  },
  {
    id: 'scenic-location',
    name: 'Scenic Location',
    description: 'Beautiful farms and countryside views',
    image: 'brighter-with-blooms-1',
    keywords: ['scenic', 'views', 'countryside', 'beautiful', 'landscape']
  },
  {
    id: 'on-site-activities',
    name: 'On-site Activities',
    description: 'Tours, workshops, and farm experiences',
    image: 'cedar-barn-homestead-3',
    keywords: ['activities', 'tours', 'workshops', 'experiences', 'events']
  },
  {
    id: 'artisan-gifts',
    name: 'Artisan Gifts',
    description: 'Handmade crafts and unique gifts',
    image: 'les-jardins-ecologistes-gregoire-2',
    keywords: ['gifts', 'crafts', 'artisan', 'handmade', 'unique']
  },
  {
    id: 'honey-beeswax',
    name: 'Honey & Beeswax',
    description: 'Raw honey and bee products',
    image: 'smirlholm-farms-2',
    keywords: ['honey', 'beeswax', 'bees', 'apiary', 'hive']
  },
  {
    id: 'cafes-eateries',
    name: 'Cafés & Eateries',
    description: 'On-site restaurants, cafés, and food services',
    image: 'euphie-dici-4',
    keywords: ['cafe', 'restaurant', 'eatery', 'dining', 'food', 'bistro']
  }
];

export const Categories: React.FC = () => {
  const navigate = useNavigate();
  const { clearItinerary, addProducer } = useItinerary();
  const { latitude, longitude } = useLocation();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [producers, setProducers] = useState<Producer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load producers data
  useEffect(() => {
    const loadProducers = async () => {
      try {
        const response = await fetch('/data/producers.json');
        if (!response.ok) {
          throw new Error('Failed to load producers data');
        }
        const data = await response.json();
        setProducers(data.producers || []);
      } catch (err) {
        console.error('Failed to load producers:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      }
    };

    loadProducers();
  }, []);

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleContinue = async () => {
    if (selectedCategories.length === 0 || producers.length === 0) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('[Categories] Building itinerary for:', selectedCategories);
      
      // Clear existing itinerary
      clearItinerary();
      
      // Build category-based itinerary
      const userLocation = latitude && longitude 
        ? { lat: latitude, lng: longitude }
        : undefined;
        
      const result = buildCategoryItinerary({
        selectedCategoryIds: selectedCategories,
        producers,
        userLocation,
        maxStops: 5
      });
      
      console.log('[Categories] Itinerary built:', result);
      
      if (result.selectedProducers.length === 0) {
        setError(result.reasoning);
        return;
      }
      
      // Add selected producers to itinerary
      result.selectedProducers.forEach(producer => {
        addProducer(producer);
      });
      
      // Store additional metadata for the itinerary page
      sessionStorage.setItem('categoryItineraryInfo', JSON.stringify({
        selectedCategories,
        reasoning: result.reasoning,
        categoryBreakdown: result.categoryBreakdown
      }));
      
      // Navigate to populated itinerary
      navigate('/itinerary');
      
    } catch (err) {
      console.error('[Categories] Error building itinerary:', err);
      setError(err instanceof Error ? err.message : 'Failed to build itinerary');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="mx-auto max-w-4xl text-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl mb-2">
          What interests you?
        </h1>
        <p className="text-base text-muted-foreground">
          Select the categories that match your interests. Our AI will find the perfect producers for your farm tour.
        </p>
        
        {/* Build Itinerary Button */}
        <Button
          onClick={handleContinue}
          disabled={isLoading || selectedCategories.length === 0}
          size="lg"
          className="mt-4"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Building Your Itinerary...
            </>
          ) : (
            <>
              Build AI Itinerary
              <ArrowRight className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>
      </div>

      {/* Category Grid */}
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {categories.map((category) => {
            const isSelected = selectedCategories.includes(category.id);
            
            return (
              <div
                key={category.id}
                className={cn(
                  "relative overflow-hidden cursor-pointer transition-all rounded-lg",
                  "hover:shadow-lg hover:scale-[1.02]",
                  isSelected && "ring-2 ring-primary ring-offset-2"
                )}
                onClick={() => toggleCategory(category.id)}
              >
                {/* Category Image */}
                <div className="aspect-square relative">
                  <ProducerImage 
                    producerSlug={category.image}
                    alt={category.name}
                    size="full"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className={cn(
                    "absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent",
                    isSelected && "from-primary/80"
                  )} />
                  
                  {/* Selection Indicator */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 bg-white rounded-full p-1">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  
                  {/* Category Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                    <h3 className="font-semibold text-base mb-0.5">{category.name}</h3>
                    <p className="text-xs opacity-90 line-clamp-2">{category.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center items-center">
          {selectedCategories.length > 0 && (
            <div className="text-sm text-muted-foreground">
              {selectedCategories.length} {selectedCategories.length === 1 ? 'category' : 'categories'} selected
            </div>
          )}
          
          <div className="flex gap-3">
            {selectedCategories.length > 0 && (
              <Button
                variant="outline"
                onClick={() => setSelectedCategories([])}
                size="sm"
                disabled={isLoading}
              >
                <X className="mr-2 h-4 w-4" />
                Clear Selection
              </Button>
            )}
            
            <Button
              onClick={handleContinue}
              disabled={selectedCategories.length === 0 || isLoading || producers.length === 0}
              size={selectedCategories.length > 0 ? "default" : "sm"}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Building Itinerary...
                </>
              ) : (
                <>
                  Build AI Itinerary
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>Select at least one category to continue. The more you select, the more diverse your tour will be!</p>
          <p className="mt-1">Prefer to browse all producers instead? <Button variant="link" className="p-0 h-auto" onClick={() => navigate('/producers')}>View all producers</Button></p>
        </div>
      </div>
    </div>
  );
};