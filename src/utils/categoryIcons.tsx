import React from 'react';
import { 
  Carrot, 
  Apple, 
  Milk, 
  Beef, 
  Egg, 
  Cookie,
  TreePine,
  Wheat,
  Leaf,
  Flower,
  Package,
  Cake
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ProducerCategory } from '@/types';

export const CATEGORY_ICONS: Record<ProducerCategory, LucideIcon> = {
  'vegetables': Carrot,
  'fruits': Apple,
  'dairy': Milk,
  'meat': Beef,
  'eggs': Egg,
  'honey': Cookie, // Using Cookie as a placeholder for honey
  'maple': TreePine,
  'grains': Wheat,
  'herbs': Leaf,
  'flowers': Flower,
  'preserves': Package,
  'baked-goods': Cake
};

export const getCategoryIcon = (category: ProducerCategory): LucideIcon => {
  return CATEGORY_ICONS[category] || Package;
};

export const CategoryIcon: React.FC<{
  category: ProducerCategory;
  className?: string;
}> = ({ category, className }) => {
  const Icon = getCategoryIcon(category);
  return <Icon className={className} />;
};

export const getPrimaryCategoryIcon = (categories: string[]): LucideIcon => {
  if (categories.length === 0) return Package;
  
  // Find the first valid category
  const validCategory = categories.find(cat => 
    CATEGORY_ICONS[cat as ProducerCategory]
  ) as ProducerCategory;
  
  return validCategory ? CATEGORY_ICONS[validCategory] : Package;
};