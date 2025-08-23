import React, { useState, useEffect, useMemo } from 'react';
import { Map, List } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Producer } from '@/types';
import { ProducerList } from '@/components/ProducerList';
import { FilterBar } from '@/components/FilterBar';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { MapView } from '@/components/map/MapView';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const Producers: React.FC = () => {
  const navigate = useNavigate();
  const [producers, setProducers] = useState<Producer[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  
  // Filter states
  const [search, setSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);

  // Load producers data
  useEffect(() => {
    const loadProducers = async () => {
      try {
        const response = await fetch('/data/producers.json');
        const data = await response.json();
        setProducers(data.producers);
      } catch (error) {
        console.error('Failed to load producers:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducers();
  }, []);

  // Filter producers based on search and filters
  const filteredProducers = useMemo(() => {
    return producers.filter(producer => {
      // Search filter
      if (search) {
        const searchLower = search.toLowerCase();
        const matchesSearch = 
          producer.name.toLowerCase().includes(searchLower) ||
          producer.description.toLowerCase().includes(searchLower) ||
          producer.location.address.toLowerCase().includes(searchLower);
        
        if (!matchesSearch) return false;
      }

      // Category filter
      if (selectedCategories.length > 0) {
        const hasCategory = producer.categories.some(cat => 
          selectedCategories.includes(cat)
        );
        if (!hasCategory) return false;
      }

      // Activity filter
      if (selectedActivities.length > 0) {
        const hasActivity = producer.activities.some(act => 
          selectedActivities.includes(act)
        );
        if (!hasActivity) return false;
      }

      return true;
    });
  }, [producers, search, selectedCategories, selectedActivities]);

  // Filter handlers
  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleActivityToggle = (activity: string) => {
    setSelectedActivities(prev =>
      prev.includes(activity)
        ? prev.filter(a => a !== activity)
        : [...prev, activity]
    );
  };

  const handleClearFilters = () => {
    setSearch('');
    setSelectedCategories([]);
    setSelectedActivities([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div>
        <div className="container mx-auto py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Agricultural Producers</h1>
              <p className="text-muted-foreground">
                Showing {filteredProducers.length} of {producers.length} producers
              </p>
            </div>
            
            {/* View Mode Toggle */}
            <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'list' | 'map')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="list" className="flex items-center gap-2">
                  <List className="h-4 w-4" />
                  List
                </TabsTrigger>
                <TabsTrigger value="map" className="flex items-center gap-2">
                  <Map className="h-4 w-4" />
                  Map
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Filters */}
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        selectedCategories={selectedCategories}
        onCategoryToggle={handleCategoryToggle}
        selectedActivities={selectedActivities}
        onActivityToggle={handleActivityToggle}
        onClearFilters={handleClearFilters}
      />

      {/* Content */}
      <div className="container mx-auto py-6">
        {viewMode === 'list' ? (
          <ProducerList producers={filteredProducers} />
        ) : (
          <div className="h-[600px]">
            <MapView 
              producers={filteredProducers}
              onProducerClick={(producer) => {
                navigate(`/producer/${producer.id}`);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};