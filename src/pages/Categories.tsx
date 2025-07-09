import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Leaf, Milk, Fish, Utensils, ShoppingBasket } from 'lucide-react';

const categories = [
  { name: 'Farm Fresh', icon: Leaf, description: 'Fruits, vegetables, and more.' },
  { name: 'Dairy & Cheese', icon: Milk, description: 'Artisanal cheeses and dairy.' },
  { name: 'Meat & Seafood', icon: Fish, description: 'Local butchers and fisheries.' },
  { name: 'Ready to Eat', icon: Utensils, description: 'Prepared meals and bakeries.' },
  { name: 'Artisan Goods', icon: ShoppingBasket, description: 'Handmade and unique products.' },
];

const CategoriesPage: React.FC = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Build Your Itinerary
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Select one or more categories to find producers that match your interests.
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card key={category.name} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center gap-4">
              <category.icon className="h-8 w-8 text-green-600" />
              <CardTitle>{category.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{category.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Button size="lg" asChild>
          <Link to="/producers">Continue to Producers</Link>
        </Button>
      </div>
    </div>
  );
};

export default CategoriesPage; 