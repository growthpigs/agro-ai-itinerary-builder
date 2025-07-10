import React from 'react';
import { MapPin, Route, Calendar, Users, Sparkles, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SafeLink } from '@/components/ui/SafeLink';

export const Home: React.FC = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('/src/assets/images/banner-home.jpg')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/60 to-white/80" />
        <div className="relative container mx-auto px-4 py-20 sm:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
              <Sparkles className="mr-2 h-4 w-4" />
              Discover Eastern Ontario's Agricultural Heritage
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Create Your Perfect
              <span className="text-primary"> Farm Tour</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
              Build personalized itineraries featuring 26 local agricultural producers. 
              From fresh produce to artisanal crafts, experience the best of Eastern Ontario.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" asChild>
                <SafeLink 
                  href="/producers"
                  type="internal"
                  producerName="Home"
                  linkLabel="explore-producers-hero"
                >
                  <MapPin className="mr-2 h-5 w-5" />
                  Explore Producers
                </SafeLink>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <SafeLink 
                  href="/itinerary"
                  type="internal"
                  producerName="Home"
                  linkLabel="build-itinerary-hero"
                >
                  <Route className="mr-2 h-5 w-5" />
                  Build Itinerary
                </SafeLink>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Everything You Need for the Perfect Farm Tour
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Our AI-powered platform makes it easy to discover and visit local producers
          </p>
        </div>
        
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="relative overflow-hidden border-muted hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>GPS-Enabled Routes</CardTitle>
              <CardDescription>
                Get turn-by-turn directions to each producer with optimized loop routes that bring you back to your starting point
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="relative overflow-hidden border-muted hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>26 Local Producers</CardTitle>
              <CardDescription>
                Discover farms, orchards, breweries, and artisan shops offering everything from fresh produce to handmade crafts
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="relative overflow-hidden border-muted hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Seasonal Highlights</CardTitle>
              <CardDescription>
                Find what's fresh and available now, from spring maple syrup to summer berries and fall harvests
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="relative overflow-hidden border-muted hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>AI-Powered Matching</CardTitle>
              <CardDescription>
                Get personalized recommendations based on your interests, dietary preferences, and available time
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="relative overflow-hidden border-muted hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Time-Optimized Tours</CardTitle>
              <CardDescription>
                Create half-day or full-day itineraries with 3-4 stops, perfectly timed for a memorable experience
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="relative overflow-hidden border-muted hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Route className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Share & Export</CardTitle>
              <CardDescription>
                Save your itineraries, share with friends, or export to your favorite navigation app
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t bg-muted/50">
        <div className="container mx-auto px-4 py-16 sm:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold">
              Start Your Agricultural Adventure
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Join thousands discovering the rich agricultural heritage of Eastern Ontario
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" asChild>
                <SafeLink 
                  href="/producers"
                  type="internal"
                  producerName="Home"
                  linkLabel="start-exploring-cta"
                >
                  Start Exploring
                  <ArrowRight className="ml-2 h-5 w-5" />
                </SafeLink>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};