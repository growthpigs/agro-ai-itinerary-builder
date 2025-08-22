import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Types for all possible link configurations
export type LinkType = 'internal' | 'external' | 'phone' | 'email' | 'action';

export interface SafeLinkProps {
  href?: string | null | undefined;
  type: LinkType;
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  disabled?: boolean;
  disabledMessage?: string;
  // For debugging
  producerName?: string;
  linkLabel?: string;
}

/**
 * SafeLink: A centralized component that handles ALL link rendering
 * 
 * Principles:
 * 1. Never render an anchor without a valid href
 * 2. Always prevent event bubbling for nested links
 * 3. Provide clear visual feedback for disabled/invalid links
 * 4. Handle all link types uniformly
 * 5. Log all issues for debugging
 */
export const SafeLink: React.FC<SafeLinkProps> = ({
  href,
  type,
  children,
  className,
  onClick,
  disabled = false,
  disabledMessage = 'Link unavailable',
  producerName = 'Unknown',
  linkLabel = 'link'
}) => {
  // Validate href based on type
  const validateHref = (): { isValid: boolean; validatedHref: string; reason?: string } => {
    // If explicitly disabled, don't validate
    if (disabled) {
      return { isValid: false, validatedHref: '', reason: 'Explicitly disabled' };
    }

    // Check for null/undefined/empty
    if (!href || href.trim() === '') {
      console.warn(`[SafeLink - ${producerName}] Empty ${type} ${linkLabel}`);
      return { isValid: false, validatedHref: '', reason: 'No URL provided' };
    }

    const trimmedHref = href.trim();

    switch (type) {
      case 'internal':
        // Internal routes should start with /
        if (!trimmedHref.startsWith('/')) {
          console.warn(`[SafeLink - ${producerName}] Invalid internal route: ${trimmedHref}`);
          return { isValid: false, validatedHref: '', reason: 'Invalid route format' };
        }
        return { isValid: true, validatedHref: trimmedHref };

      case 'external':
        // Ensure protocol exists
        let url = trimmedHref;
        if (!url.match(/^https?:\/\//i)) {
          url = `https://${url}`;
        }
        try {
          new URL(url); // Validate URL format
          return { isValid: true, validatedHref: url };
        } catch {
          console.warn(`[SafeLink - ${producerName}] Invalid external URL: ${trimmedHref}`);
          return { isValid: false, validatedHref: '', reason: 'Invalid URL format' };
        }

      case 'phone':
        // Remove non-numeric for validation
        const cleanPhone = trimmedHref.replace(/\D/g, '');
        if (cleanPhone.length < 10) {
          console.warn(`[SafeLink - ${producerName}] Invalid phone: ${trimmedHref}`);
          return { isValid: false, validatedHref: '', reason: 'Invalid phone number' };
        }
        // Ensure tel: prefix
        const telHref = trimmedHref.startsWith('tel:') ? trimmedHref : `tel:${trimmedHref}`;
        return { isValid: true, validatedHref: telHref };

      case 'email':
        // Basic email validation
        if (!trimmedHref.includes('@')) {
          console.warn(`[SafeLink - ${producerName}] Invalid email: ${trimmedHref}`);
          return { isValid: false, validatedHref: '', reason: 'Invalid email format' };
        }
        // Ensure mailto: prefix
        const mailtoHref = trimmedHref.startsWith('mailto:') ? trimmedHref : `mailto:${trimmedHref}`;
        return { isValid: true, validatedHref: mailtoHref };

      case 'action':
        // Action links are buttons, not anchors
        return { isValid: true, validatedHref: '#' };

      default:
        console.warn(`[SafeLink - ${producerName}] Unknown link type: ${type}`);
        return { isValid: false, validatedHref: '', reason: 'Unknown link type' };
    }
  };

  const { isValid, validatedHref, reason } = validateHref();

  // DEBUG: Log validation results
  if (!isValid) {
    console.warn(`[SafeLink Invalid - ${producerName}]`, {
      type,
      originalHref: href,
      validatedHref,
      reason,
      linkLabel,
      currentURL: window.location.href
    });
  }

  // Handle click with proper event management
  const handleClick = (e: React.MouseEvent) => {
    // Always stop propagation to prevent card clicks
    e.stopPropagation();
    
    // Log the click for debugging
    console.log(`[SafeLink Click - ${producerName}]`, {
      type,
      href: validatedHref,
      isValid,
      linkLabel
    });

    // If invalid, prevent default
    if (!isValid || type === 'action') {
      e.preventDefault();
    }

    // Call custom onClick if provided
    if (onClick) {
      onClick(e);
    }
  };

  // If invalid, render a disabled state with tooltip
  if (!isValid) {
    const disabledElement = (
      <span
        className={cn(
          'inline-flex items-center justify-center opacity-50 cursor-not-allowed',
          className
        )}
        aria-disabled="true"
        role="link"
      >
        {children}
      </span>
    );

    // Only show tooltip if there's a message
    if (disabledMessage && reason) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {disabledElement}
            </TooltipTrigger>
            <TooltipContent>
              <p>{disabledMessage}: {reason}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return disabledElement;
  }

  // For action type, render a button-like span
  if (type === 'action') {
    return (
      <span
        className={cn('cursor-pointer', className)}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleClick(e as any);
          }
        }}
      >
        {children}
      </span>
    );
  }

  // For internal links, use React Router
  if (type === 'internal') {
    return (
      <Link
        to={validatedHref}
        className={className}
        onClick={handleClick}
      >
        {children}
      </Link>
    );
  }

  // For external links, use regular anchor with security attributes
  return (
    <a
      href={validatedHref}
      className={className}
      onClick={handleClick}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
};