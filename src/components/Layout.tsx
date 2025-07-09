import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MapPin, Home, Route, Info, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ItineraryBar } from '@/components/itinerary/ItineraryBar';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  console.log('Layout rendering, current path:', location.pathname);

  const navItems = [
    { path: '/', icon: Route, label: 'Itinerary' },
    { path: '/home', icon: Home, label: 'Home' },
    { path: '/producers', icon: MapPin, label: 'Producers' },
    { path: '/about', icon: Info, label: 'About' },
  ];

  return (
    <div className="relative min-h-screen bg-background">
      {/* Modern Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <Link to="/" className="mr-6 flex items-center space-x-2">
              <MapPin className="h-6 w-6 text-primary" />
              <span className="hidden font-bold sm:inline-block">
                AGRO AI
              </span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'transition-colors hover:text-foreground/80',
                    location.pathname === item.path
                      ? 'text-foreground'
                      : 'text-foreground/60'
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <Link to="/" className="flex items-center space-x-2 md:hidden">
              <MapPin className="h-6 w-6 text-primary" />
              <span className="font-bold">AGRO AI</span>
            </Link>
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button
                  variant="ghost"
                  className="px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="pr-0">
                <nav className="grid gap-6 text-lg font-medium">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          'flex items-center space-x-2 text-muted-foreground transition-colors hover:text-foreground',
                          location.pathname === item.path && 'text-foreground'
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-32">
        {children}
      </main>

      {/* Itinerary Bar */}
      <ItineraryBar />
    </div>
  );
};