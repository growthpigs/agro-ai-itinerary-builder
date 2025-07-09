import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
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
  const [showFilters, setShowFilters] = useState(false);
  const hasActiveFilters = selectedCategories.length > 0 || selectedActivities.length > 0 || search.length > 0;

  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto py-4">
        {/* Search and Filter Toggle */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search producers..."
              className="pl-8"
            />
          </div>
          
          {/* Desktop Filters Button */}
          <Button
            variant={showFilters || hasActiveFilters ? "default" : "outline"}
            onClick={() => setShowFilters(!showFilters)}
            className="hidden sm:flex"
          >
            <Filter className="mr-2 h-4 w-4" />
            Filters
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-2">
                {selectedCategories.length + selectedActivities.length + (search ? 1 : 0)}
              </Badge>
            )}
          </Button>

          {/* Mobile Filters Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant={hasActiveFilters ? "default" : "outline"}
                size="icon"
                className="sm:hidden"
              >
                <Filter className="h-4 w-4" />
                {hasActiveFilters && (
                  <Badge variant="secondary" className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center">
                    {selectedCategories.length + selectedActivities.length}
                  </Badge>
                )}
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

        {/* Desktop Expandable Filters */}
        {showFilters && (
          <div className="mt-4 space-y-4 hidden sm:block">
            {/* Categories */}
            <div>
              <h3 className="text-sm font-medium mb-3">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                  <Badge
                    key={value}
                    variant={selectedCategories.includes(value) ? "default" : "outline"}
                    className="cursor-pointer transition-colors hover:bg-primary/10"
                    onClick={() => onCategoryToggle(value)}
                  >
                    {label}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Activities */}
            <div>
              <h3 className="text-sm font-medium mb-3">Activities</h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(ACTIVITY_LABELS).map(([value, label]) => (
                  <Badge
                    key={value}
                    variant={selectedActivities.includes(value) ? "default" : "outline"}
                    className="cursor-pointer transition-colors hover:bg-primary/10"
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
                size="sm"
                onClick={onClearFilters}
              >
                <X className="mr-2 h-4 w-4" />
                Clear all filters
              </Button>
            )}
          </div>
        )}

        {/* Active Filters Summary */}
        {hasActiveFilters && !showFilters && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {search && (
              <Badge variant="secondary">
                Search: "{search}"
                <button
                  onClick={() => onSearchChange('')}
                  className="ml-1 hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {selectedCategories.map((cat) => (
              <Badge key={cat} variant="secondary">
                {CATEGORY_LABELS[cat as keyof typeof CATEGORY_LABELS]}
                <button
                  onClick={() => onCategoryToggle(cat)}
                  className="ml-1 hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {selectedActivities.map((act) => (
              <Badge key={act} variant="secondary">
                {ACTIVITY_LABELS[act as keyof typeof ACTIVITY_LABELS]}
                <button
                  onClick={() => onActivityToggle(act)}
                  className="ml-1 hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};