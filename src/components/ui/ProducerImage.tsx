import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { imageIdMapping } from '@/data/imageIdMapping';

interface ProducerImageProps {
  producerSlug: string;
  alt: string;
  size?: 'full' | 'medium' | 'thumb';
  className?: string;
  loading?: 'lazy' | 'eager';
}

export const ProducerImage: React.FC<ProducerImageProps> = ({
  producerSlug,
  alt,
  size = 'medium',
  className,
  loading = 'lazy'
}) => {
  const [hasError, setHasError] = useState(false);
  const basePath = '/images/producers';
  
  const sizeClasses = {
    full: 'w-[800px] h-[800px]',
    medium: 'w-[400px] h-[400px]',
    thumb: 'w-[200px] h-[200px]'
  };
  
  // Apply ID mapping to fix mismatches
  const mappedSlug = imageIdMapping[producerSlug] || producerSlug;
  
  // Use placeholder for missing images or errors
  if (mappedSlug === 'placeholder' || hasError) {
    return (
      <img
        src="/images/placeholder.svg"
        alt={alt}
        loading={loading}
        className={cn(
          'object-cover',
          sizeClasses[size],
          'max-w-full h-auto',
          className
        )}
      />
    );
  }
  
  // DEBUG: Log every image path attempt
  console.log('[ProducerImage Debug]', {
    originalSlug: producerSlug,
    mappedSlug,
    size,
    webpPath: `${basePath}/webp/${size}/${mappedSlug}.webp`,
    jpgPath: `${basePath}/jpg/${size}/${mappedSlug}.jpg`,
    currentURL: window.location.href,
    baseURI: document.baseURI
  });

  return (
    <picture className={cn('block overflow-hidden', className)}>
      <source
        srcSet={`${basePath}/webp/${size}/${mappedSlug}.webp`}
        type="image/webp"
      />
      <source
        srcSet={`${basePath}/jpg/${size}/${mappedSlug}.jpg`}
        type="image/jpeg"
      />
      <img
        src={`${basePath}/jpg/${size}/${mappedSlug}.jpg`}
        alt={alt}
        loading={loading}
        className={cn(
          'object-cover',
          sizeClasses[size],
          'max-w-full h-auto'
        )}
        onError={(e) => {
          console.error('[ProducerImage Error]', {
            failedSrc: e.currentTarget.src,
            producerSlug,
            size,
            error: 'Image failed to load'
          });
          setHasError(true);
        }}
      />
    </picture>
  );
};