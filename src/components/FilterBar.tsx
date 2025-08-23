import React from 'react';
import { Search, X } from 'lucide-react';
import { CATEGORY_LABELS, ACTIVITY_LABELS } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface FilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  selectedCategories: string[];
  onCategoryToggle: (category: string) => void;
  selectedActivities: string[];
  onActivityToggle: (activity: string) => void;
  onClearFilters: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  search,
  onSearchChange,
  selectedCategories,
  onCategoryToggle,
  selectedActivities,
  onActivityToggle,
  onClearFilters,
}) => {
  const hasActiveFilters = selectedCategories.length > 0 || selectedActivities.length > 0 || search.length > 0;

  return (
    <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto py-4">
        {/* Desktop: Single line with filters on left and search on right */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Filter chips on the left */}
          <div className="flex-1 flex items-center gap-2 overflow-x-auto">
            {/* Most popular categories */}
            {[
              ['fruits', CATEGORY_LABELS.fruits],
              ['vegetables', CATEGORY_LABELS.vegetables],
              ['dairy', CATEGORY_LABELS.dairy],
              ['meat', CATEGORY_LABELS.meat],
              ['baked-goods', CATEGORY_LABELS['baked-goods']]
            ].map(([value, label]) => (
              <Badge
                key={value}
                variant={selectedCategories.includes(value) ? "default" : "outline"}
                className="cursor-pointer transition-colors hover:bg-primary/10 whitespace-nowrap"
                onClick={() => onCategoryToggle(value)}
              >
                {label}
              </Badge>
            ))}
            
            <div className="h-4 w-px bg-border" />
            
            {/* Most popular activities */}
            {[
              ['pick-your-own', ACTIVITY_LABELS['pick-your-own']],
              ['farm-store', ACTIVITY_LABELS['farm-store']],
              ['farm-tours', ACTIVITY_LABELS['farm-tours']]
            ].map(([value, label]) => (
              <Badge
                key={value}
                variant={selectedActivities.includes(value) ? "default" : "outline"}
                className="cursor-pointer transition-colors hover:bg-primary/10 whitespace-nowrap"
                onClick={() => onActivityToggle(value)}
              >
                {label}
              </Badge>
            ))}
            
            {/* More filters dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Badge
                  variant="outline"
                  className="cursor-pointer transition-colors hover:bg-primary/10 whitespace-nowrap"
                >
                  More filters
                </Badge>
              </DialogTrigger>
              <DialogContent className="max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>All Filters</DialogTitle>
                  <DialogDescription>
                    Select categories and activities to filter producers
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 pt-4">
                  {/* All Categories */}
                  <div>
                    <h3 className="font-medium mb-3">Categories</h3>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                        <Badge
                          key={value}
                          variant={selectedCategories.includes(value) ? "default" : "outline"}
                          className="cursor-pointer transition-colors"
                          onClick={() => onCategoryToggle(value)}
                        >
                          {label}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* All Activities */}
                  <div>
                    <h3 className="font-medium mb-3">Activities</h3>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(ACTIVITY_LABELS).map(([value, label]) => (
                        <Badge
                          key={value}
                          variant={selectedActivities.includes(value) ? "default" : "outline"}
                          className="cursor-pointer transition-colors"
                          onClick={() => onActivityToggle(value)}
                        >
                          {label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            {/* Clear button if filters are active */}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="h-6 px-2"
              >
                <X className="h-3 w-3 mr-1" />
                Clear
              </Button>
            )}
          </div>
          
          {/* Search on the right */}
          <div className="relative w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search producers..."
              className="pl-9"
            />
          </div>
        </div>

        {/* Mobile: Search bar and filter dialog */}
        <div className="sm:hidden flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search..."
              className="pl-9"
            />
          </div>
          
          {/* Mobile Filters Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant={hasActiveFilters ? "default" : "outline"}
                size="icon"
              >
                <Badge variant={hasActiveFilters ? "default" : "outline"} className="h-9 px-3">
                  Filters
                  {hasActiveFilters && (
                    <span className="ml-1">({selectedCategories.length + selectedActivities.length})</span>
                  )}
                </Badge>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Filter Producers</DialogTitle>
                <DialogDescription>
                  Select categories and activities to filter producers
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 pt-4">
                {/* Categories */}
                <div>
                  <h3 className="font-medium mb-3">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                      <Badge
                        key={value}
                        variant={selectedCategories.includes(value) ? "default" : "outline"}
                        className="cursor-pointer transition-colors"
                        onClick={() => onCategoryToggle(value)}
                      >
                        {label}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Activities */}
                <div>
                  <h3 className="font-medium mb-3">Activities</h3>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(ACTIVITY_LABELS).map(([value, label]) => (
                      <Badge
                        key={value}
                        variant={selectedActivities.includes(value) ? "default" : "outline"}
                        className="cursor-pointer transition-colors"
                        onClick={() => onActivityToggle(value)}
                      >
                        {label}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    onClick={onClearFilters}
                    className="w-full"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Clear all filters
                  </Button>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};