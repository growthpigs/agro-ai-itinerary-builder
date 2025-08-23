import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MapPin, Home, Route, Info, Menu, Grid3X3, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ItineraryBar } from '@/components/itinerary/ItineraryBar';
import { LocationPermissionBanner } from '@/components/LocationPermissionBanner';
import { SafeLink } from '@/components/ui/SafeLink';
import savourEastLogo from '@/assets/images/savour-east-logo.png';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Version indicator for debugging deployments
  const VERSION = 'v2.2.0-thin-nav';
  console.log('Layout rendering, current path:', location.pathname, 'VERSION:', VERSION);

  const navItems = [
    { path: '/', icon: Route, label: 'Make Itinerary' },
    { path: '/producers', icon: MapPin, label: 'Producers' },
    { path: '/categories', icon: Grid3X3, label: 'Categories' },
    { path: '/itinerary', icon: Route, label: 'Itinerary' },
    { path: '/home', icon: Home, label: 'How it Works' },
    { path: '/about', icon: Info, label: 'About' },
  ];

  return (
    <div className="relative min-h-screen bg-background">
      {/* Location Permission Banner */}
      <LocationPermissionBanner />
      
      {/* Modern Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-[67px] items-center justify-between">
          <SafeLink
            href="https://savourthefield.ca"
            type="external"
            className="flex items-center space-x-2"
            producerName="Layout"
            linkLabel="logo-desktop"
          >
            <img
              src={savourEastLogo}
              alt="Savour East"
              className="h-6 w-auto sm:h-8 md:h-10"
            />
            <span className="hidden font-bold sm:inline-block text-[10px] sm:text-xs md:text-sm font-onset tracking-wide leading-none">
              Savour East
            </span>
          </SafeLink>
          
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {navItems.map((item) => (
              <SafeLink
                key={item.path}
                href={item.path}
                type="internal"
                className={cn(
                  'transition-colors hover:text-foreground/80',
                  location.pathname === item.path
                    ? 'text-orange-800'
                    : 'text-foreground/60'
                )}
                producerName="Layout"
                linkLabel={`nav-${item.label.toLowerCase()}`}
              >
                {item.label}
              </SafeLink>
            ))}
            {/* External Links */}
            <SafeLink
              href="https://savourthefield.ca"
              type="external"
              className="transition-colors text-foreground/60 hover:text-foreground/80"
              producerName="Layout"
              linkLabel="nav-stf"
            >
              Savour the Field
            </SafeLink>
            <SafeLink
              href="https://network.savoureaston.ca"
              type="external"
              className="transition-colors text-foreground/60 hover:text-foreground/80"
              producerName="Layout"
              linkLabel="nav-eoan"
            >
              EOAN Network
            </SafeLink>
          </nav>
          
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
              <SheetContent side="right" className="pr-6 pl-6 pt-6 pb-8 flex flex-col">
                <nav className="grid gap-3 text-lg font-medium">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <SafeLink
                        key={item.path}
                        href={item.path}
                        type="internal"
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          'flex items-center space-x-2 text-muted-foreground transition-colors hover:text-foreground py-2 px-2 -mx-2 rounded-md hover:bg-muted/50',
                          location.pathname === item.path && 'text-orange-800 bg-muted/30'
                        )}
                        producerName="Layout"
                        linkLabel={`mobile-nav-${item.label.toLowerCase()}`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="leading-tight">{item.label}</span>
                      </SafeLink>
                    );
                  })}
                {/* External Links (Mobile) */}
                  <SafeLink
                    href="https://savourthefield.ca"
                    type="external"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2 text-muted-foreground transition-colors hover:text-foreground py-2 px-2 -mx-2 rounded-md hover:bg-muted/50"
                    producerName="Layout"
                    linkLabel="mobile-nav-stf"
                  >
                    <span className="leading-tight">Savour the Field</span>
                  </SafeLink>
                  <SafeLink
                    href="https://network.savoureaston.ca"
                    type="external"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2 text-muted-foreground transition-colors hover:text-foreground py-2 px-2 -mx-2 rounded-md hover:bg-muted/50"
                    producerName="Layout"
                    linkLabel="mobile-nav-eoan"
                  >
                    <span className="leading-tight">EOAN Network</span>
                  </SafeLink>
                </nav>

                {/* Footer info in mobile menu */}
                <div className="mt-8 pt-4 border-t">
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p className="font-semibold text-foreground">Savour East</p>
                    <p>Discover Eastern Ontario's agricultural heritage through personalized farm tours.</p>
                    <p className="text-xs">© 2025 Savour East. All rights reserved.</p>
                    <p className="text-xs">A project supporting local agriculture and sustainable tourism.</p>
                    <p className="text-xs text-orange-600">Version: {VERSION}</p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-32">
        {children}
      </main>

      {/* Footer - Desktop Only */}
      <footer className="hidden md:block bg-muted/50 border-t mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <img 
                  src={savourEastLogo} 
                  alt="Savour East" 
                  className="h-6 w-auto"
                />
                Savour East
              </h3>
              <p className="text-sm text-muted-foreground">
                Discover Eastern Ontario's agricultural heritage through personalized farm tours.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3">About the Project</h3>
              <p className="text-sm text-muted-foreground">
                Supporting local agriculture and sustainable tourism by connecting visitors with the region's finest producers.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Contact</h3>
              <p className="text-sm text-muted-foreground">
                Eastern Ontario, Canada<br />
                info@agro-on.ca
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>© 2025 Savour East. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Itinerary Bar */}
      <ItineraryBar />

      {/* Admin Access Button - Bottom Left */}
      <SafeLink
        href="/admin"
        type="internal"
        className="fixed bottom-4 left-4 z-50"
        producerName="Layout"
        linkLabel="admin-access"
      >
        <Button
          size="sm"
          variant="outline"
          className="w-10 h-10 p-0 bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-gray-50/90 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Settings className="h-4 w-4 text-gray-600" />
          <span className="sr-only">Admin Panel</span>
        </Button>
      </SafeLink>
    </div>
  );
};