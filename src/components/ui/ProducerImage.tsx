import React from 'react';
import { cn } from '@/lib/utils';

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
  const basePath = '/images/producers';
  
  // DEBUG: Log every image path attempt
  console.log('[ProducerImage Debug]', {
    producerSlug,
    size,
    webpPath: `${basePath}/webp/${size}/${producerSlug}.webp`,
    jpgPath: `${basePath}/jpg/${size}/${producerSlug}.jpg`,
    currentURL: window.location.href,
    baseURI: document.baseURI
  });
  
  const sizeClasses = {
    full: 'w-[800px] h-[800px]',
    medium: 'w-[400px] h-[400px]',
    thumb: 'w-[200px] h-[200px]'
  };

  return (
    <picture className={cn('block overflow-hidden', className)}>
      <source
        srcSet={`${basePath}/webp/${size}/${producerSlug}.webp`}
        type="image/webp"
      />
      <source
        srcSet={`${basePath}/jpg/${size}/${producerSlug}.jpg`}
        type="image/jpeg"
      />
      <img
        src={`${basePath}/jpg/${size}/${producerSlug}.jpg`}
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
        }}
      />
    </picture>
  );
};