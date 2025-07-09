import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ProducerCard } from '@/components/producer/ProducerCard';
import { Producer, ProductCategory, FarmActivity } from '@/types/producer.types';

/**
 * Example test file for ProducerCard component
 * Demonstrates testing patterns for the AGRO AI Itinerary Builder
 */

// Mock producer data factory
const createMockProducer = (overrides?: Partial<Producer>): Producer => ({
  id: 'test-producer-1',
  name: 'Sunshine Valley Farm',
  description: 'Family-owned organic vegetable farm with u-pick strawberries',
  location: {
    lat: 45.4215,
    lng: -75.6972,
    address: '123 Farm Road, Ottawa, ON K1A 0B1',
    region: 'Eastern Ontario'
  },
  categories: [ProductCategory.VEGETABLES, ProductCategory.FRUITS],
  activities: [FarmActivity.FARM_STORE, FarmActivity.PICK_YOUR_OWN],
  hours: {
    monday: '9:00 AM - 5:00 PM',
    tuesday: '9:00 AM - 5:00 PM',
    wednesday: '9:00 AM - 5:00 PM',
    thursday: '9:00 AM - 5:00 PM',
    friday: '9:00 AM - 6:00 PM',
    saturday: '8:00 AM - 6:00 PM',
    sunday: '10:00 AM - 4:00 PM'
  },
  contact: {
    phone: '613-555-0123',
    email: 'info@sunshinevalley.ca',
    website: 'https://sunshinevalley.ca'
  },
  images: ['/images/producers/sunshine-valley.jpg'],
  seasonalAvailability: {
    spring: ['asparagus', 'rhubarb', 'lettuce'],
    summer: ['strawberries', 'tomatoes', 'corn'],
    fall: ['pumpkins', 'apples', 'squash'],
    winter: ['stored vegetables', 'preserves']
  },
  accessibility: {
    wheelchairAccessible: true,
    parkingAvailable: true,
    restroomAvailable: true,
    assistanceAvailable: true
  },
  ratings: {
    average: 4.5,
    count: 127,
    lastUpdated: new Date('2024-01-01')
  },
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date('2024-01-01'),
  ...overrides
});

describe('ProducerCard', () => {
  const mockOnSelect = vi.fn();
  const defaultProducer = createMockProducer();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Rendering', () => {
    it('should render producer information correctly', () => {
      render(<ProducerCard producer={defaultProducer} />);

      // Check basic information is displayed
      expect(screen.getByText('Sunshine Valley Farm')).toBeInTheDocument();
      expect(screen.getByText(/Family-owned organic vegetable farm/)).toBeInTheDocument();
      expect(screen.getByText(/123 Farm Road/)).toBeInTheDocument();
    });

    it('should display categories as badges', () => {
      render(<ProducerCard producer={defaultProducer} />);

      expect(screen.getByText('vegetables')).toBeInTheDocument();
      expect(screen.getByText('fruits')).toBeInTheDocument();
    });

    it('should show wheelchair accessibility icon when accessible', () => {
      render(<ProducerCard producer={defaultProducer} />);

      const wheelchairIcon = screen.getByTestId('wheelchair-icon');
      expect(wheelchairIcon).toBeInTheDocument();
    });

    it('should not show wheelchair icon when not accessible', () => {
      const inaccessibleProducer = createMockProducer({
        accessibility: {
          wheelchairAccessible: false,
          parkingAvailable: true,
          restroomAvailable: true
        }
      });

      render(<ProducerCard producer={inaccessibleProducer} />);

      expect(screen.queryByTestId('wheelchair-icon')).not.toBeInTheDocument();
    });

    it('should display operating hours', () => {
      render(<ProducerCard producer={defaultProducer} />);

      expect(screen.getByText(/Open 9:00 AM - 5:00 PM/)).toBeInTheDocument();
    });

    it('should handle closed days correctly', () => {
      const closedMondayProducer = createMockProducer({
        hours: {
          ...defaultProducer.hours,
          monday: 'Closed'
        }
      });

      // Mock current day as Monday
      vi.setSystemTime(new Date('2024-01-08')); // A Monday

      render(<ProducerCard producer={closedMondayProducer} />);

      expect(screen.getByText('Closed today')).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('should call onSelect when card is clicked', async () => {
      const user = userEvent.setup();
      
      render(
        <ProducerCard 
          producer={defaultProducer} 
          onSelect={mockOnSelect} 
        />
      );

      const card = screen.getByRole('article');
      await user.click(card);

      expect(mockOnSelect).toHaveBeenCalledTimes(1);
      expect(mockOnSelect).toHaveBeenCalledWith(defaultProducer);
    });

    it('should apply selected styles when isSelected is true', () => {
      render(
        <ProducerCard 
          producer={defaultProducer} 
          isSelected={true} 
        />
      );

      const card = screen.getByRole('article');
      expect(card).toHaveClass('ring-2', 'ring-primary');
    });

    it('should show hover effects', async () => {
      const user = userEvent.setup();
      
      render(<ProducerCard producer={defaultProducer} />);

      const card = screen.getByRole('article');
      await user.hover(card);

      expect(card).toHaveClass('hover:shadow-lg');
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing optional data gracefully', () => {
      const minimalProducer = createMockProducer({
        ratings: undefined,
        contact: {
          phone: undefined,
          email: undefined,
          website: undefined
        }
      });

      render(<ProducerCard producer={minimalProducer} />);

      // Should not crash and display basic info
      expect(screen.getByText('Sunshine Valley Farm')).toBeInTheDocument();
    });

    it('should truncate long descriptions', () => {
      const longDescriptionProducer = createMockProducer({
        description: 'A'.repeat(200) // Very long description
      });

      render(<ProducerCard producer={longDescriptionProducer} />);

      const description = screen.getByText(/^A+/);
      expect(description.textContent?.length).toBeLessThan(200);
    });

    it('should handle empty categories array', () => {
      const noCategoriesProducer = createMockProducer({
        categories: []
      });

      render(<ProducerCard producer={noCategoriesProducer} />);

      // Should render without crashing
      expect(screen.getByText('Sunshine Valley Farm')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(
        <ProducerCard 
          producer={defaultProducer} 
          onSelect={mockOnSelect} 
        />
      );

      const card = screen.getByRole('article', {
        name: /Sunshine Valley Farm/i
      });
      expect(card).toBeInTheDocument();
    });

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup();
      
      render(
        <ProducerCard 
          producer={defaultProducer} 
          onSelect={mockOnSelect} 
        />
      );

      // Tab to the card
      await user.tab();
      
      const card = screen.getByRole('article');
      expect(card).toHaveFocus();

      // Press Enter to select
      await user.keyboard('{Enter}');
      expect(mockOnSelect).toHaveBeenCalledWith(defaultProducer);
    });

    it('should announce selection state to screen readers', () => {
      const { rerender } = render(
        <ProducerCard 
          producer={defaultProducer} 
          isSelected={false} 
        />
      );

      const card = screen.getByRole('article');
      expect(card).toHaveAttribute('aria-selected', 'false');

      rerender(
        <ProducerCard 
          producer={defaultProducer} 
          isSelected={true} 
        />
      );

      expect(card).toHaveAttribute('aria-selected', 'true');
    });
  });

  describe('Performance', () => {
    it('should not re-render unnecessarily', () => {
      const renderSpy = vi.fn();
      
      const TestWrapper = ({ producer }: { producer: Producer }) => {
        renderSpy();
        return <ProducerCard producer={producer} />;
      };

      const { rerender } = render(<TestWrapper producer={defaultProducer} />);
      expect(renderSpy).toHaveBeenCalledTimes(1);

      // Re-render with same props
      rerender(<TestWrapper producer={defaultProducer} />);
      
      // Should use memoization and not re-render
      expect(renderSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Integration', () => {
    it('should work within a list of producers', () => {
      const producers = [
        createMockProducer({ id: '1', name: 'Farm 1' }),
        createMockProducer({ id: '2', name: 'Farm 2' }),
        createMockProducer({ id: '3', name: 'Farm 3' })
      ];

      render(
        <div>
          {producers.map(producer => (
            <ProducerCard 
              key={producer.id}
              producer={producer} 
              onSelect={mockOnSelect}
            />
          ))}
        </div>
      );

      expect(screen.getByText('Farm 1')).toBeInTheDocument();
      expect(screen.getByText('Farm 2')).toBeInTheDocument();
      expect(screen.getByText('Farm 3')).toBeInTheDocument();
    });
  });
});

// Example of testing async behavior
describe('ProducerCard with async data', () => {
  it('should handle lazy-loaded images', async () => {
    const producer = createMockProducer();
    
    render(<ProducerCard producer={producer} />);

    // Wait for image to load
    await waitFor(() => {
      const image = screen.getByAltText(producer.name);
      expect(image).toHaveAttribute('src', producer.images[0]);
    });
  });
});

// Example of snapshot testing
describe('ProducerCard snapshots', () => {
  it('should match snapshot for default props', () => {
    const { container } = render(
      <ProducerCard producer={defaultProducer} />
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot when selected', () => {
    const { container } = render(
      <ProducerCard 
        producer={defaultProducer} 
        isSelected={true} 
      />
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});