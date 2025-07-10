// Link validation utility for debugging and ensuring valid links
export const validateLink = (
  linkType: 'phone' | 'website' | 'maps' | 'internal' | 'see-more',
  value: string | undefined | null,
  producerName: string
): { isValid: boolean; href: string; warning?: string } => {
  const logPrefix = `[LinkValidator - ${producerName}]`;
  
  // Helper to log warnings
  const logWarning = (message: string) => {
    const warning = `${logPrefix} ${message}`;
    console.warn(warning);
    return warning;
  };

  switch (linkType) {
    case 'phone':
      if (!value || value.trim() === '') {
        return {
          isValid: false,
          href: '#',
          warning: logWarning(`Missing phone number`)
        };
      }
      // Remove any non-numeric characters for validation
      const cleanPhone = value.replace(/\D/g, '');
      if (cleanPhone.length < 10) {
        return {
          isValid: false,
          href: '#',
          warning: logWarning(`Invalid phone number: ${value}`)
        };
      }
      return { isValid: true, href: `tel:${value}` };

    case 'website':
      if (!value || value.trim() === '') {
        return {
          isValid: false,
          href: '#',
          warning: logWarning(`Missing website URL`)
        };
      }
      // Ensure URL has protocol
      let url = value.trim();
      if (!url.match(/^https?:\/\//i)) {
        url = `https://${url}`;
      }
      try {
        new URL(url); // Validate URL format
        return { isValid: true, href: url };
      } catch {
        return {
          isValid: false,
          href: '#',
          warning: logWarning(`Invalid website URL: ${value}`)
        };
      }

    case 'maps':
      // Maps links are generated from coordinates, so we just need to validate they exist
      if (!value) {
        return {
          isValid: false,
          href: '#',
          warning: logWarning(`Missing coordinates for maps link`)
        };
      }
      return { isValid: true, href: value };

    case 'internal':
    case 'see-more':
      if (!value || value.trim() === '') {
        return {
          isValid: false,
          href: '#',
          warning: logWarning(`Missing internal route: ${linkType}`)
        };
      }
      return { isValid: true, href: value };

    default:
      return {
        isValid: false,
        href: '#',
        warning: logWarning(`Unknown link type: ${linkType}`)
      };
  }
};

// Debug logger for click events
export const logLinkClick = (
  event: React.MouseEvent,
  linkType: string,
  href: string,
  producerName: string
) => {
  console.log(`[LinkClick - ${producerName}]`, {
    linkType,
    href,
    defaultPrevented: event.defaultPrevented,
    propagationStopped: event.isPropagationStopped(),
    target: event.target,
    currentTarget: event.currentTarget,
  });
};