import React from 'react';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface FloatingActionButtonProps {
  icon: LucideIcon;
  onClick: () => void;
  label: string;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  icon: Icon,
  onClick,
  label,
  variant = 'secondary',
  size = 'md',
  className,
  disabled = false,
}) => {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-14 h-14',
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  const variantClasses = {
    primary: 'bg-orange-600 text-white hover:bg-orange-700 shadow-lg hover:shadow-xl',
    secondary: 'bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={cn(
        'rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-105 active:scale-95',
        sizeClasses[size],
        variantClasses[variant],
        disabled && 'opacity-50 cursor-not-allowed hover:scale-100',
        className
      )}
    >
      <Icon className={iconSizes[size]} />
    </button>
  );
};

interface FloatingActionButtonGroupProps {
  children: React.ReactNode;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
}

export const FloatingActionButtonGroup: React.FC<FloatingActionButtonGroupProps> = ({
  children,
  position = 'bottom-right',
  className,
}) => {
  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  };

  return (
    <div
      className={cn(
        'absolute z-20 flex flex-col gap-3',
        positionClasses[position],
        className
      )}
    >
      {children}
    </div>
  );
};