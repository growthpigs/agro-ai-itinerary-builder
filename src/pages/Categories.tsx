import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ProducerImage } from '@/components/ui/ProducerImage';

interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  keywords: string[];
}

const categories: Category[] = [
  {
    id: 'vegetables',
    name: 'Fresh Vegetables',
    description: 'Seasonal produce from local farms',
    image: 'les-jardins-ecologistes-gregoire-1',
    keywords: ['vegetables', 'produce', 'greens', 'organic']
  },
  {
    id: 'fruits',
    name: 'Fruits & Berries',
    description: 'Pick-your-own and farm-fresh fruits',
    image: 'avonmore-berry-farm-1',
    keywords: ['fruits', 'berries', 'apples', 'strawberries']
  },
  {
    id: 'dairy',
    name: 'Dairy Products',
    description: 'Fresh milk, cheese, and yogurt',
    image: 'kirkview-farms-1',
    keywords: ['dairy', 'milk', 'cheese', 'yogurt']
  },
  {
    id: 'meat',
    name: 'Meat & Poultry',
    description: 'Locally raised beef, pork, and chicken',
    image: 'l-orignal-packing-1',
    keywords: ['meat', 'beef', 'pork', 'chicken', 'poultry']
  },
  {
    id: 'maple',
    name: 'Maple Products',
    description: 'Pure maple syrup and treats',
    image: 'springfield-farm-1',
    keywords: ['maple', 'syrup', 'sugar bush']
  },
  {
    id: 'honey',
    name: 'Honey & Beeswax',
    description: 'Raw honey and bee products',
    image: 'gibbs-honey-1',
    keywords: ['honey', 'beeswax', 'apiary']
  },
  {
    id: 'artisan',
    name: 'Artisan Crafts',
    description: 'Handmade goods and crafts',
    image: 'garden-path-homemade-soap-1',
    keywords: ['crafts', 'artisan', 'handmade']
  },
  {
    id: 'beverages',
    name: 'Beverages',
    description: 'Wine, beer, and cider',
    image: 'vankleek-hill-vineyard-1',
    keywords: ['wine', 'beer', 'cider', 'brewery', 'winery']
  },
  {
    id: 'bakery',
    name: 'Baked Goods',
    description: 'Fresh bread and pastries',
    image: 'simply-baked-catering-1',
    keywords: ['bakery', 'bread', 'pastries', 'baked goods']
  }
];

export const Categories: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleContinue = () => {
    if (selectedCategories.length === 0) return;
    
    // Store the selected categories in sessionStorage for now
    const selectedKeywords = categories
      .filter(cat => selectedCategories.includes(cat.id))
      .flatMap(cat => cat.keywords);
    
    sessionStorage.setItem('selectedCategories', JSON.stringify({
      categories: selectedCategories,
      keywords: selectedKeywords
    }));
    
    // Navigate to itinerary page
    navigate('/itinerary');
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
              >
                <X className="mr-2 h-4 w-4" />
                Clear Selection
              </Button>
            )}
            
            <Button
              onClick={handleContinue}
              disabled={selectedCategories.length === 0}
              size={selectedCategories.length > 0 ? "default" : "sm"}
            >
              Continue to AI Itinerary
              <ArrowRight className="ml-2 h-4 w-4" />
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