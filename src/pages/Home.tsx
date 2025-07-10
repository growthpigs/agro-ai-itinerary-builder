import React from 'react';
import { MapPin, Route, Calendar, Users, Sparkles, Clock, ArrowRight, CheckCircle, Navigation, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SafeLink } from '@/components/ui/SafeLink';

export const Home: React.FC = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 py-16 sm:py-24">
          <div className="mx-auto max-w-4xl">
            <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
              Plan Your Eastern Ontario Farm Tour in 3 Simple Steps
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Our AI-powered itinerary builder connects you with 26 local agricultural producers. 
              Create a personalized GPS-enabled loop route that fits your interests and schedule.
            </p>
            
            {/* Visual Process Steps */}
            <div className="mt-12 grid gap-8 sm:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white">
                  <span className="text-2xl font-bold">1</span>
                </div>
                <h3 className="mb-2 font-semibold">Choose Your Interests</h3>
                <p className="text-sm text-muted-foreground">
                  Select from fresh produce, farm tours, artisan crafts, or seasonal activities
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white">
                  <span className="text-2xl font-bold">2</span>
                </div>
                <h3 className="mb-2 font-semibold">Get AI Recommendations</h3>
                <p className="text-sm text-muted-foreground">
                  Our AI matches you with 3-4 producers based on location and preferences
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white">
                  <span className="text-2xl font-bold">3</span>
                </div>
                <h3 className="mb-2 font-semibold">Navigate Your Route</h3>
                <p className="text-sm text-muted-foreground">
                  Follow your optimized loop route with GPS directions back to your start
                </p>
              </div>
            </div>
            
            <div className="mt-12 flex justify-center">
              <Button size="lg" asChild>
                <SafeLink 
                  href="/itinerary"
                  type="internal"
                  producerName="Home"
                  linkLabel="get-started-hero"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </SafeLink>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-4 text-2xl font-bold sm:text-3xl">
            How the AGRO AI Itinerary Builder Works
          </h2>
          <p className="mb-12 text-lg text-muted-foreground">
            Follow these steps to create your perfect agricultural tour
          </p>
          
          {/* Step-by-step guide */}
          <div className="space-y-8">
            <Card className="border-l-4 border-l-primary">
              <CardHeader className="flex flex-row items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-2">
                  <CardTitle className="text-xl">Step 1: Set Your Starting Point</CardTitle>
                  <CardDescription className="text-base">
                    Allow location access or manually enter your starting address. The app will create a loop route that brings you back to where you started.
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
            
            <Card className="border-l-4 border-l-primary">
              <CardHeader className="flex flex-row items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-2">
                  <CardTitle className="text-xl">Step 2: Select Your Preferences</CardTitle>
                  <CardDescription className="text-base">
                    Choose what interests you: vegetables, fruits, dairy, meat, maple syrup, honey, or artisan crafts. Specify activities like farm tours, pick-your-own, or shopping at farm stores.
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
            
            <Card className="border-l-4 border-l-primary">
              <CardHeader className="flex flex-row items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-2">
                  <CardTitle className="text-xl">Step 3: AI Creates Your Itinerary</CardTitle>
                  <CardDescription className="text-base">
                    Our AI analyzes all 26 producers to find the best matches for you. It considers distance, operating hours, seasonal availability, and creates an efficient route with 3-4 stops.
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
            
            <Card className="border-l-4 border-l-primary">
              <CardHeader className="flex flex-row items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Navigation className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-2">
                  <CardTitle className="text-xl">Step 4: Navigate Your Tour</CardTitle>
                  <CardDescription className="text-base">
                    View your route on an interactive map. Get turn-by-turn directions to each stop. The app works offline once your itinerary is loaded, perfect for rural areas with limited cell coverage.
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
            
            <Card className="border-l-4 border-l-primary">
              <CardHeader className="flex flex-row items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Share2 className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-2">
                  <CardTitle className="text-xl">Step 5: Save and Share</CardTitle>
                  <CardDescription className="text-base">
                    Save your itinerary for future use or share it with friends and family. Export to your favorite navigation app or print a summary with all producer details.
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>
        
        {/* Key Features */}
        <div className="mt-16 border-t pt-16">
          <h3 className="mb-8 text-xl font-semibold">Key Features</h3>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex gap-3">
              <Users className="h-5 w-5 shrink-0 text-primary" />
              <div>
                <h4 className="font-medium">26 Verified Producers</h4>
                <p className="text-sm text-muted-foreground">Farms, orchards, breweries, and artisan shops</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Route className="h-5 w-5 shrink-0 text-primary" />
              <div>
                <h4 className="font-medium">Loop Routes</h4>
                <p className="text-sm text-muted-foreground">Efficient paths that return to your start</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Calendar className="h-5 w-5 shrink-0 text-primary" />
              <div>
                <h4 className="font-medium">Seasonal Availability</h4>
                <p className="text-sm text-muted-foreground">Know what's fresh and available now</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Clock className="h-5 w-5 shrink-0 text-primary" />
              <div>
                <h4 className="font-medium">Time Optimization</h4>
                <p className="text-sm text-muted-foreground">Half-day or full-day tour options</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <MapPin className="h-5 w-5 shrink-0 text-primary" />
              <div>
                <h4 className="font-medium">GPS Navigation</h4>
                <p className="text-sm text-muted-foreground">Turn-by-turn directions to each stop</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Share2 className="h-5 w-5 shrink-0 text-primary" />
              <div>
                <h4 className="font-medium">Share & Export</h4>
                <p className="text-sm text-muted-foreground">Save or share your custom itinerary</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ready to Start Section */}
      <section className="border-t bg-muted/50">
        <div className="container mx-auto px-4 py-16 sm:py-24">
          <div className="mx-auto max-w-3xl">
            <Card className="border-0 bg-background shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Ready to Plan Your Farm Tour?</CardTitle>
                <CardDescription className="mt-2 text-base">
                  Choose how you want to start exploring Eastern Ontario's agricultural producers
                </CardDescription>
              </CardHeader>
              <div className="p-6 pt-0">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Card className="group cursor-pointer transition-colors hover:border-primary">
                    <SafeLink 
                      href="/producers"
                      type="internal"
                      producerName="Home"
                      linkLabel="browse-producers-cta"
                      className="block p-6"
                    >
                      <div className="text-center">
                        <Users className="mx-auto mb-3 h-8 w-8 text-primary" />
                        <h3 className="mb-2 font-semibold">Browse All Producers</h3>
                        <p className="text-sm text-muted-foreground">
                          Explore our complete directory of 26 farms and artisan shops
                        </p>
                      </div>
                    </SafeLink>
                  </Card>
                  
                  <Card className="group cursor-pointer transition-colors hover:border-primary">
                    <SafeLink 
                      href="/itinerary"
                      type="internal"
                      producerName="Home"
                      linkLabel="create-itinerary-cta"
                      className="block p-6"
                    >
                      <div className="text-center">
                        <Sparkles className="mx-auto mb-3 h-8 w-8 text-primary" />
                        <h3 className="mb-2 font-semibold">Create AI Itinerary</h3>
                        <p className="text-sm text-muted-foreground">
                          Let our AI build a personalized tour based on your preferences
                        </p>
                      </div>
                    </SafeLink>
                  </Card>
                </div>
              </div>
            </Card>
            
            <div className="mt-8 text-center text-sm text-muted-foreground">
              <p>This is a Progressive Web App (PWA) - install it on your phone for the best experience!</p>
              <p className="mt-2">Works offline once your itinerary is loaded.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};