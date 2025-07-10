import React from 'react';
import type { Producer } from '@/types';
import { ProducerCard } from './ProducerCard';

interface ProducerListProps {
  producers: Producer[];
  onProducerSelect?: (producer: Producer) => void;
  selectedProducerIds?: string[];
  emptyMessage?: string;
}

export const ProducerList: React.FC<ProducerListProps> = ({
  producers,
  onProducerSelect,
  selectedProducerIds = [],
  emptyMessage = "No producers found matching your criteria."
}) => {
  if (producers.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
      {producers.map((producer) => (
        <ProducerCard
          key={producer.id}
          producer={producer}
          onSelect={onProducerSelect}
          isSelected={selectedProducerIds.includes(producer.id)}
        />
      ))}
    </div>
  );
};