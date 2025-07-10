import React from 'react';
import { cn } from '@/lib/utils';

interface ProducerImageProps {
  producerSlug: string;
  alt: string;
  size?: 'full' | 'medium' | 'thumb';
  className?: string;
  loading?: 'lazy' | 'eager';
}

const getActualImageSlug = (producerSlug: string, size: string): string => {
  let debugTrace: string[] = [];
  debugTrace.push(`Input: producerSlug="${producerSlug}", size="${size}"`);
  
  // Map producer IDs to actual image file names based on size
  const imageSlugMap: Record<string, Record<string, string>> = {
    'cafe-joyeux': {
      full: 'Café Joyeux 1',
      medium: 'cafe-joyeux-1', 
      thumb: 'Café Joyeux 1'
    },
    'ferme-butte-bine': {
      full: 'ferme-butte-et-bine-1',
      medium: 'ferme-butte-et-bine-1',
      thumb: 'ferme-butte-et-bine-1'
    },
    'fraser-creek-pizza': {
      full: 'fraser-creek-pizza-farm-1',
      medium: 'fraser-creek-pizza-farm-1',
      thumb: 'fraser-creek-pizza-farm-1'
    },
    'garden-path-soap': {
      full: 'garden-path-homemade-soap-1',
      medium: 'garden-path-homemade-soap-1',
      thumb: 'garden-path-homemade-soap-1'
    },
    'les-jardins-ecologistes': {
      full: 'Les Jardins Écologistes Grégoire1',
      medium: 'Les Jardins Écologistes Grégoire1',
      thumb: 'Les Jardins Écologistes Grégoire1'
    },
    'les-jardins-ecologistes-gregoire': {
      full: 'Les Jardins Écologistes Grégoire1',
      medium: 'Les Jardins Écologistes Grégoire1',
      thumb: 'Les Jardins Écologistes Grégoire1'
    },
    'les-jardins-ecologistes-gregoire-1': {
      full: 'Les Jardins Écologistes Grégoire1',
      medium: 'Les Jardins Écologistes Grégoire1',
      thumb: 'Les Jardins Écologistes Grégoire1'
    },
    'l-orignal-packing-1': {
      full: 'lorignal-packing-1',
      medium: 'lorignal-packing-1',
      thumb: 'lorignal-packing-1'
    },
    'avonmore-berry-farm': {
      full: 'avonmore-berry-farm-1',
      medium: 'avonmore-berry-farm-1',
      thumb: 'avonmore-berry-farm-1'
    },
    'bercier-catering': {
      full: 'bercier-catering-1',
      medium: 'bercier-catering-1',
      thumb: 'bercier-catering-1'
    },
    'bischoff-orchards': {
      full: 'bischoff-orchards-1',
      medium: 'bischoff-orchards-1',
      thumb: 'bischoff-orchards-1'
    },
    'brauwerk-hoffman': {
      full: 'brauwerk-hoffman-1',
      medium: 'brauwerk-hoffman-1',
      thumb: 'brauwerk-hoffman-1'
    },
    'brighter-with-blooms': {
      full: 'brighter-with-blooms-1',
      medium: 'brighter-with-blooms-1',
      thumb: 'brighter-with-blooms-1'
    },
    'broken-stick': {
      full: 'broken-stick-1',
      medium: 'broken-stick-1',
      thumb: 'broken-stick-1'
    },
    'cedar-barn-homestead': {
      full: 'cedar-barn-homestead-1',
      medium: 'cedar-barn-homestead-1',
      thumb: 'cedar-barn-homestead-1'
    },
    'euphie-dici': {
      full: 'euphie-dici-1',
      medium: 'euphie-dici-1',
      thumb: 'euphie-dici-1'
    },
    'gibbs-honey': {
      full: 'gibbs-honey-1',
      medium: 'gibbs-honey-1',
      thumb: 'gibbs-honey-1'
    },
    'halls-apple-market': {
      full: 'halls-apple-market-1',
      medium: 'halls-apple-market-1',
      thumb: 'halls-apple-market-1'
    },
    'jamink-farm': {
      full: 'jamink-farm-1',
      medium: 'jamink-farm-1',
      thumb: 'jamink-farm-1'
    },
    'kirkview-farms': {
      full: 'kirkview-farms-1',
      medium: 'kirkview-farms-1',
      thumb: 'kirkview-farms-1'
    },
    'les-fruits-du-poirier': {
      full: 'les-fruits-du-poirier-1',
      medium: 'les-fruits-du-poirier-1',
      thumb: 'les-fruits-du-poirier-1'
    },
    'les-vergers-villeneuve': {
      full: 'les-vergers-villeneuve-1',
      medium: 'les-vergers-villeneuve-1',
      thumb: 'les-vergers-villeneuve-1'
    },
    'lorignal-packing': {
      full: 'lorignal-packing-1',
      medium: 'lorignal-packing-1',
      thumb: 'lorignal-packing-1'
    },
    'mariposa-farm': {
      full: 'mariposa-farm-1',
      medium: 'mariposa-farm-1',
      thumb: 'mariposa-farm-1'
    },
    'martines-kitchen': {
      full: 'martines-kitchen-1',
      medium: 'martines-kitchen-1',
      thumb: 'martines-kitchen-1'
    },
    'simply-baked-catering': {
      full: 'simply-baked-catering-1',
      medium: 'simply-baked-catering-1',
      thumb: 'simply-baked-catering-1'
    },
    'smirlholm-farms': {
      full: 'smirlholm-farms-1',
      medium: 'smirlholm-farms-1',
      thumb: 'smirlholm-farms-1'
    },
    'springfield-farm': {
      full: 'springfield-farm-1',
      medium: 'springfield-farm-1',
      thumb: 'springfield-farm-1'
    },
    'vankleek-hill-vineyard': {
      full: 'vankleek-hill-vineyard-1',
      medium: 'vankleek-hill-vineyard-1',
      thumb: 'vankleek-hill-vineyard-1'
    }
  };

  // Check if we have a specific mapping for this producer and size
  debugTrace.push(`Checking direct mapping for "${producerSlug}"`);
  if (imageSlugMap[producerSlug] && imageSlugMap[producerSlug][size]) {
    const result = imageSlugMap[producerSlug][size];
    debugTrace.push(`Found direct mapping: "${result}"`);
    console.log('[getActualImageSlug] Direct mapping found:', { producerSlug, size, result, trace: debugTrace });
    return result;
  }
  debugTrace.push('No direct mapping found, checking numbered variations');

  // Handle numbered variations (producer-id-2, producer-id-3, etc.)
  const baseProducerMatch = producerSlug.match(/^(.+)-(\d+)$/);
  debugTrace.push(`Regex match result: ${baseProducerMatch ? 'found' : 'not found'}`);
  
  if (baseProducerMatch) {
    const [, baseProducer, imageNum] = baseProducerMatch;
    debugTrace.push(`Extracted: baseProducer="${baseProducer}", imageNum="${imageNum}"`);
    
    if (imageSlugMap[baseProducer] && imageSlugMap[baseProducer][size]) {
      const baseMapping = imageSlugMap[baseProducer][size];
      const result = baseMapping.replace(/\d+$/, imageNum);
      debugTrace.push(`Using base mapping: "${baseMapping}" -> "${result}"`);
      console.log('[getActualImageSlug] Base mapping used:', { producerSlug, size, baseProducer, imageNum, baseMapping, result, trace: debugTrace });
      return result;
    }
    
    // Special handling for cafe-joyeux numbered images
    if (baseProducer === 'cafe-joyeux') {
      const result = size === 'thumb' ? `Café Joyeux ${imageNum}` : `cafe-joyeux-${imageNum}`;
      debugTrace.push(`Using cafe-joyeux special handling: "${result}"`);
      console.log('[getActualImageSlug] Cafe-joyeux special handling:', { producerSlug, size, baseProducer, imageNum, result, trace: debugTrace });
      return result;
    }
    
    // Special handling for les-jardins-ecologistes numbered images
    if (baseProducer === 'les-jardins-ecologistes-gregoire') {
      const result = `Les Jardins Écologistes Grégoire${imageNum}`;
      debugTrace.push(`Using les-jardins special handling: "${result}"`);
      console.log('[getActualImageSlug] Les-jardins special handling:', { producerSlug, size, baseProducer, imageNum, result, trace: debugTrace });
      return result;
    }
    
    debugTrace.push(`No special handling for baseProducer="${baseProducer}"`);
  }

  // Default fallback: add -1 suffix
  const result = `${producerSlug}-1`;
  debugTrace.push(`Using default fallback: "${result}"`);
  console.log('[getActualImageSlug] Default fallback used:', { producerSlug, size, result, trace: debugTrace });
  return result;
};

export const ProducerImage: React.FC<ProducerImageProps> = ({
  producerSlug,
  alt,
  size = 'medium',
  className,
  loading = 'lazy'
}) => {
  const basePath = '/images/producers';
  const actualSlug = getActualImageSlug(producerSlug, size);
  
  // DEBUG: Log every image path attempt with detailed mapping info
  console.log('[ProducerImage Debug - DETAILED]', {
    originalSlug: producerSlug,
    mappedSlug: actualSlug,
    requestedSize: size,
    webpPath: `${basePath}/webp/${size}/${actualSlug}.webp`,
    jpgPath: `${basePath}/jpg/${size}/${actualSlug}.jpg`,
    currentURL: window.location.href
  });
  
  const sizeClasses = {
    full: 'w-[800px] h-[800px]',
    medium: 'w-[400px] h-[400px]',
    thumb: 'w-[200px] h-[200px]'
  };

  // TEMPORARY DEBUG: Test direct JPG loading for cafe-joyeux
  const isDebugging = producerSlug.includes('cafe-joyeux');
  
  if (isDebugging) {
    console.log('[ProducerImage] TEMP DEBUG - Testing direct JPG for cafe-joyeux:', {
      directJpgPath: `${basePath}/jpg/${size}/${actualSlug}.jpg`
    });
    
    return (
      <img
        src={`${basePath}/jpg/${size}/${actualSlug}.jpg`}
        alt={alt}
        loading={loading}
        className={cn(
          'object-cover',
          sizeClasses[size],
          'max-w-full h-auto'
        )}
        onError={(e) => {
          console.error('[ProducerImage] TEMP DEBUG ERROR:', {
            failedSrc: e.currentTarget.src,
            producerSlug,
            actualSlug,
            size
          });
          e.currentTarget.src = '/images/placeholder.svg';
        }}
      />
    );
  }

  return (
    <picture className={cn('block overflow-hidden', className)}>
      <source
        srcSet={`${basePath}/webp/${size}/${actualSlug}.webp`}
        type="image/webp"
      />
      <source
        srcSet={`${basePath}/jpg/${size}/${actualSlug}.jpg`}
        type="image/jpeg"
      />
      <img
        src={`${basePath}/jpg/${size}/${actualSlug}.jpg`}
        alt={alt}
        loading={loading}
        className={cn(
          'object-cover',
          sizeClasses[size],
          'max-w-full h-auto'
        )}
        onError={(e) => {
          console.error('[ProducerImage Error - DETAILED]', {
            failedSrc: e.currentTarget.src,
            producerSlug,
            actualSlug,
            size,
            webpAttempted: `${basePath}/webp/${size}/${actualSlug}.webp`,
            jpgAttempted: `${basePath}/jpg/${size}/${actualSlug}.jpg`,
            error: 'Image failed to load',
            currentTarget: e.currentTarget,
            imageElement: e.currentTarget.outerHTML
          });
          
          // Check if this is already the placeholder to avoid infinite loops
          if (!e.currentTarget.src.includes('placeholder.svg')) {
            console.log('[ProducerImage] Switching to placeholder due to error');
            e.currentTarget.src = '/images/placeholder.svg';
          }
        }}
      />
    </picture>
  );
};