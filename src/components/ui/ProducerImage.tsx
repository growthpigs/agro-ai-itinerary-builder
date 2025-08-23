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
      full: 'Cafe Joyeux 1',
      medium: 'cafe-joyeux-1', 
      thumb: 'Cafe Joyeux 1'
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
      full: 'Les Jardins Ecologistes Gregoire1',
      medium: 'Les Jardins Ecologistes Gregoire1',
      thumb: 'Les Jardins Ecologistes Gregoire1'
    },
    'les-jardins-ecologistes-gregoire': {
      full: 'Les Jardins Ecologistes Gregoire1',
      medium: 'Les Jardins Ecologistes Gregoire1',
      thumb: 'Les Jardins Ecologistes Gregoire1'
    },
    'les-jardins-ecologistes-gregoire-1': {
      full: 'Les Jardins Ecologistes Gregoire1',
      medium: 'Les Jardins Ecologistes Gregoire1',
      thumb: 'Les Jardins Ecologistes Gregoire1'
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
    'brighter-with-blooms-1': {
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
    'cedar-barn-homestead-3': {
      full: 'cedar-barn-homestead-3',
      medium: 'cedar-barn-homestead-3',
      thumb: 'cedar-barn-homestead-3'
    },
    'euphie-dici': {
      full: 'euphie-dici-1',
      medium: 'euphie-dici-1',
      thumb: 'euphie-dici-1'
    },
    'euphie-dici-4': {
      full: 'euphie-dici-4',
      medium: 'euphie-dici-4',
      thumb: 'euphie-dici-4'
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
    'smirlholm-farms-2': {
      full: 'smirlholm-farms-2',
      medium: 'smirlholm-farms-2',
      thumb: 'smirlholm-farms-2'
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
    },
    'vankleek-hill-vineyard-3': {
      full: 'vankleek-hill-vineyard-3',
      medium: 'vankleek-hill-vineyard-3',
      thumb: 'vankleek-hill-vineyard-3'
    },
    'avonmore-berry-farm-4': {
      full: 'avonmore-berry-farm-4',
      medium: 'avonmore-berry-farm-4',
      thumb: 'avonmore-berry-farm-4'
    },
    'les-jardins-ecologistes-gregoire-2': {
      full: 'Les Jardins Ecologistes Gregoire2',
      medium: 'Les Jardins Ecologistes Gregoire2',
      thumb: 'Les Jardins Ecologistes Gregoire2'
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
      const result = size === 'thumb' ? `Cafe Joyeux ${imageNum}` : `cafe-joyeux-${imageNum}`;
      debugTrace.push(`Using cafe-joyeux special handling: "${result}"`);
      console.log('[getActualImageSlug] Cafe-joyeux special handling:', { producerSlug, size, baseProducer, imageNum, result, trace: debugTrace });
      return result;
    }
    
    // Special handling for les-jardins-ecologistes numbered images
    if (baseProducer === 'les-jardins-ecologistes-gregoire') {
      const result = `Les Jardins Ecologistes Gregoire${imageNum}`;
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
  // List of producers that should only show placeholder images
  const placeholderOnlyProducers = new Set([
    'beaus-brewery',
    'akwesasne-tent',
    'fernwood-estates',
    'flora-kitchenette',
    'fromagerie-st-albert',
    'muddytoes-organics',
    'vignoble-clos-du-vully'
  ]);
  
  // Extract base producer ID (without number suffix)
  const baseProducerId = producerSlug.replace(/-\d+$/, '');
  
  // Check if this producer should only show placeholder
  if (placeholderOnlyProducers.has(baseProducerId)) {
    const sizeClasses = {
      full: 'w-[800px] h-[800px]',
      medium: 'w-[400px] h-[400px]',
      thumb: 'w-[200px] h-[200px]'
    };
    
    return (
      <img
        src="/images/placeholder.svg"
        alt={alt}
        loading={loading}
        className={cn(
          'object-cover',
          className || sizeClasses[size],
          'max-w-full h-auto'
        )}
      />
    );
  }
  
  const basePath = '/images/producers';
  const actualSlug = getActualImageSlug(producerSlug, size);
  
  // DEBUG: Log every image path attempt with detailed mapping info
  const jpgPath = `${basePath}/jpg/${size}/${actualSlug}.jpg`;
  const webpPath = `${basePath}/webp/${size}/${actualSlug}.webp`;
  
  // Enhanced debugging for production issues
  if (producerSlug.includes('les-jardins') || window.location.hostname !== 'localhost') {
    console.log('[ProducerImage Debug - CRITICAL]', {
      timestamp: new Date().toISOString(),
      originalSlug: producerSlug,
      mappedSlug: actualSlug,
      requestedSize: size,
      webpPath: webpPath,
      jpgPath: jpgPath,
      encodedJpgPath: encodeURI(jpgPath),
      currentURL: window.location.href,
      hostname: window.location.hostname,
      isProduction: window.location.hostname !== 'localhost',
      userAgent: navigator.userAgent
    });
  }
  
  const sizeClasses = {
    full: 'w-[800px] h-[800px]',
    medium: 'w-[400px] h-[400px]',
    thumb: 'w-[200px] h-[200px]'
  };

  // TEMPORARY DEBUG: Test direct JPG loading for problem producers
  const isDebugging = producerSlug.includes('cafe-joyeux') || producerSlug.includes('bercier-catering') || producerSlug.includes('les-jardins-ecologistes-gregoire');
  
  if (isDebugging) {
    console.log('[ProducerImage] TEMP DEBUG - Testing direct JPG for problem producers:', {
      producerSlug,
      actualSlug,
      directJpgPath: jpgPath
    });
    
    return (
      <img
        src={jpgPath}
        alt={alt}
        loading={loading}
        className={cn(
          'object-cover',
          // Use parent className for sizing if provided, otherwise use default size classes
          className || sizeClasses[size],
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
    <picture className="block overflow-hidden">
      <source
        srcSet={webpPath}
        type="image/webp"
      />
      <source
        srcSet={jpgPath}
        type="image/jpeg"
      />
      <img
        src={jpgPath}
        alt={alt}
        loading={loading}
        className={cn(
          'object-cover',
          // Use parent className for sizing if provided, otherwise use default size classes
          className || sizeClasses[size],
          'max-w-full h-auto'
        )}
        onError={(e) => {
          const failedUrl = e.currentTarget.src;
          const decodedUrl = decodeURI(failedUrl);
          
          console.error('[ProducerImage Error - CRITICAL]', {
            failedSrc: failedUrl,
            decodedSrc: decodedUrl,
            producerSlug,
            actualSlug,
            size,
            expectedPath: jpgPath,
            urlEncodingMismatch: failedUrl !== jpgPath,
            specialChars: /[àâäèéêëîïôùûüÿçœæ]/i.test(actualSlug),
            error: 'Image failed to load',
            suggestion: 'Check if file exists with exact name in public/images/producers/jpg/' + size + '/'
          });
          
          // Try URL encoding the special characters as a fallback
          if (/[àâäèéêëîïôùûüÿçœæ]/i.test(actualSlug) && !e.currentTarget.src.includes('%')) {
            const encodedPath = encodeURI(jpgPath);
            console.log('[ProducerImage] Trying encoded path:', encodedPath);
            e.currentTarget.src = encodedPath;
          } else if (!e.currentTarget.src.includes('placeholder.svg')) {
            console.log('[ProducerImage] Switching to placeholder due to error');
            e.currentTarget.src = '/images/placeholder.svg';
          }
        }}
      />
    </picture>
  );
};