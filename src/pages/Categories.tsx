import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

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
    image: '/src/assets/images/producers/webp/medium/Les Jardins Écologistes Grégoire1.webp',
    keywords: ['vegetables', 'produce', 'greens', 'organic']
  },
  {
    id: 'fruits',
    name: 'Fruits & Berries',
    description: 'Pick-your-own and farm-fresh fruits',
    image: '/src/assets/images/producers/webp/medium/Avonmore Berry Farm1.webp',
    keywords: ['fruits', 'berries', 'apples', 'strawberries']
  },
  {
    id: 'dairy',
    name: 'Dairy Products',
    description: 'Fresh milk, cheese, and yogurt',
    image: '/src/assets/images/producers/webp/medium/Kirkview Farms1.webp',
    keywords: ['dairy', 'milk', 'cheese', 'yogurt']
  },
  {
    id: 'meat',
    name: 'Meat & Poultry',
    description: 'Locally raised beef, pork, and chicken',
    image: '/src/assets/images/producers/webp/medium/L_Orignal Packing 1.webp',
    keywords: ['meat', 'beef', 'pork', 'chicken', 'poultry']
  },
  {
    id: 'maple',
    name: 'Maple Products',
    description: 'Pure maple syrup and treats',
    image: '/src/assets/images/producers/webp/medium/Springfield Farm 1.webp',
    keywords: ['maple', 'syrup', 'sugar bush']
  },
  {
    id: 'honey',
    name: 'Honey & Beeswax',
    description: 'Raw honey and bee products',
    image: '/src/assets/images/producers/webp/medium/Gibbs Honey1.webp',
    keywords: ['honey', 'beeswax', 'apiary']
  },
  {
    id: 'artisan',
    name: 'Artisan Crafts',
    description: 'Handmade goods and crafts',
    image: '/src/assets/images/producers/webp/medium/Garden Path Homemade Soap1.webp',
    keywords: ['crafts', 'artisan', 'handmade']
  },
  {
    id: 'beverages',
    name: 'Beverages',
    description: 'Wine, beer, and cider',
    image: '/src/assets/images/producers/webp/medium/Vankleek Hill Vineyard1.webp',
    keywords: ['wine', 'beer', 'cider', 'brewery', 'winery']
  },
  {
    id: 'bakery',
    name: 'Baked Goods',
    description: 'Fresh bread and pastries',
    image: '/src/assets/images/producers/webp/medium/Simply Baked Catering1.webp',
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
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mx-auto max-w-4xl text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
          What interests you?
        </h1>
        <p className="text-lg text-muted-foreground">
          Select the categories that match your interests. Our AI will find the perfect producers for your farm tour.
        </p>
      </div>

      {/* Category Grid */}
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
          {categories.map((category) => {
            const isSelected = selectedCategories.includes(category.id);
            
            return (
              <Card
                key={category.id}
                className={cn(
                  "relative overflow-hidden cursor-pointer transition-all",
                  "hover:shadow-lg hover:scale-[1.02]",
                  isSelected && "ring-2 ring-primary ring-offset-2"
                )}
                onClick={() => toggleCategory(category.id)}
              >
                {/* Category Image */}
                <div className="aspect-square relative">
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ 
                      backgroundImage: `url('${category.image}')`,
                      backgroundColor: '#f3f4f6'
                    }}
                  />
                  <div className={cn(
                    "absolute inset-0 bg-gradient-to-t from-black/60 to-transparent",
                    isSelected && "from-primary/80"
                  )} />
                  
                  {/* Selection Indicator */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 bg-white rounded-full p-1">
                      <Check className="h-5 w-5 text-primary" />
                    </div>
                  )}
                  
                  {/* Category Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="font-semibold text-lg mb-1">{category.name}</h3>
                    <p className="text-sm opacity-90">{category.description}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
          {selectedCategories.length > 0 && (
            <div className="text-sm text-muted-foreground">
              {selectedCategories.length} {selectedCategories.length === 1 ? 'category' : 'categories'} selected
            </div>
          )}
          
          <div className="flex gap-4">
            {selectedCategories.length > 0 && (
              <Button
                variant="outline"
                onClick={() => setSelectedCategories([])}
              >
                <X className="mr-2 h-4 w-4" />
                Clear Selection
              </Button>
            )}
            
            <Button
              onClick={handleContinue}
              disabled={selectedCategories.length === 0}
              size="lg"
            >
              Continue to AI Itinerary
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Select at least one category to continue. The more you select, the more diverse your tour will be!</p>
          <p className="mt-2">Prefer to browse all producers instead? <Button variant="link" className="p-0 h-auto" onClick={() => navigate('/producers')}>View all producers</Button></p>
        </div>
      </div>
    </div>
  );
};