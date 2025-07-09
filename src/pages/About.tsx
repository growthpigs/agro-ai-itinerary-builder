import React from 'react';
import { Heart, Users, Leaf, Award } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-gray-900">About AGRO AI</h1>
          <p className="mt-4 text-xl text-gray-600">
            Connecting people with Eastern Ontario's agricultural heritage
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Mission */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed">
            AGRO AI Itinerary Builder is a project by agro-on.ca, a non-profit organization 
            dedicated to promoting and supporting agricultural producers in Eastern Ontario. 
            Our mission is to make it easy for locals and tourists alike to discover, visit, 
            and support our region's diverse farms and agricultural businesses.
          </p>
        </section>

        {/* Features */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary-600" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Connect with Producers</h3>
                <p className="text-gray-600 text-sm">
                  Browse detailed profiles of 26 agricultural producers across Eastern Ontario, 
                  from vegetable farms to maple syrup producers.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Leaf className="h-6 w-6 text-primary-600" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Seasonal Experiences</h3>
                <p className="text-gray-600 text-sm">
                  Find what's fresh and available throughout the year, from spring maple syrup 
                  to summer berries and fall harvests.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Award className="h-6 w-6 text-primary-600" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Support Local</h3>
                <p className="text-gray-600 text-sm">
                  By visiting and purchasing from local producers, you're supporting sustainable 
                  agriculture and strengthening our regional food system.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Heart className="h-6 w-6 text-primary-600" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Create Memories</h3>
                <p className="text-gray-600 text-sm">
                  Build custom itineraries for family outings, educational trips, or agritourism 
                  adventures that showcase the best of our region.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Event Info */}
        <section className="mb-12 bg-primary-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-primary-900 mb-3">Agricultural Showcase Event</h2>
          <p className="text-primary-800 mb-4">
            Join us in late August for our annual agricultural showcase event! This celebration 
            brings together producers, food enthusiasts, and families for a day of farm tours, 
            tastings, and educational activities.
          </p>
          <p className="text-sm text-primary-700">
            Use this app to plan your route and make the most of your visit to participating farms.
          </p>
        </section>

        {/* Contact */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Get Involved</h2>
          <p className="text-gray-600 mb-4">
            Are you an agricultural producer in Eastern Ontario? We'd love to include you in our 
            directory. Contact us to learn more about joining our network.
          </p>
          <div className="bg-gray-100 rounded-lg p-4">
            <p className="text-sm text-gray-600">
              <strong>Organization:</strong> agro-on.ca<br />
              <strong>Region:</strong> Eastern Ontario, Canada<br />
              <strong>Focus:</strong> Agricultural promotion and agritourism
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};