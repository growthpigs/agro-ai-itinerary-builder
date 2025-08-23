import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Users, MapPin, Settings, LogOut, Plus, Edit, Trash2, Save, X, BarChart3, TrendingUp, Eye, Navigation } from 'lucide-react';
import type { Producer } from '@/types';
import { analytics } from '@/services/analytics';

interface AdminPanelProps {}

export const Admin: React.FC<AdminPanelProps> = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [producers, setProducers] = useState<Producer[]>([]);
  const [editingProducer, setEditingProducer] = useState<Producer | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  // Check authentication on mount
  useEffect(() => {
    const authStatus = sessionStorage.getItem('adminAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      loadProducers();
      loadAnalytics();
    }
  }, []);

  // Refresh analytics periodically
  useEffect(() => {
    if (isAuthenticated) {
      const interval = setInterval(() => {
        loadAnalytics();
      }, 30000); // Refresh every 30 seconds

      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  // Load producers data
  const loadProducers = async () => {
    try {
      const response = await fetch('/data/producers.json');
      const data = await response.json();
      setProducers(data.producers || []);
    } catch (error) {
      console.error('Failed to load producers:', error);
    }
  };

  // Load analytics data
  const loadAnalytics = () => {
    const data = analytics.getAnalytics();
    const totalItineraries = analytics.getTotalItineraries();
    const completedItineraries = analytics.getCompletedItineraries();
    const completionRate = analytics.getCompletionRate();
    const mostSelectedProducers = analytics.getMostSelectedProducers();
    const mostCommonItineraries = analytics.getMostCommonItineraries();
    const pageViews = analytics.getPageViews();
    const recentSessions = analytics.getRecentSessions();
    
    setAnalyticsData({
      totalSessions: data.sessions.length,
      totalItineraries,
      completedItineraries,
      completionRate,
      mostSelectedProducers,
      mostCommonItineraries,
      pageViews,
      recentSessions: recentSessions.slice(0, 10),
      weeklyData: analytics.getSessionsInPeriod(7),
    });
  };

  // Handle login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple password check - in production, this should be server-side
    if (password === 'admin2024') {
      setIsAuthenticated(true);
      sessionStorage.setItem('adminAuthenticated', 'true');
      loadProducers();
      loadAnalytics();
    } else {
      alert('Invalid password');
    }
  };

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('adminAuthenticated');
    navigate('/');
  };

  // Handle save producer (mock - in production, this would save to backend)
  const handleSaveProducer = (producer: Producer) => {
    console.log('Saving producer:', producer);
    alert('Producer saved! (Note: This is a demo - changes are not persisted)');
    setEditingProducer(null);
    setIsAddingNew(false);
  };

  // Handle delete producer (mock)
  const handleDeleteProducer = (id: string) => {
    if (confirm('Are you sure you want to delete this producer?')) {
      console.log('Deleting producer:', id);
      alert('Producer deleted! (Note: This is a demo - changes are not persisted)');
    }
  };

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Admin Access</CardTitle>
            <CardDescription>
              Enter your password to access the admin panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
              <Button type="submit" className="w-full">
                Login
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => navigate('/')}
              >
                Back to App
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Admin dashboard
  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold">Admin Panel</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => navigate('/')}>
                View Site
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Admin Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full max-w-2xl grid-cols-4">
            <TabsTrigger value="analytics">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="producers">
              <MapPin className="h-4 w-4 mr-2" />
              Producers
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="h-4 w-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Analytics Dashboard</h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadAnalytics}
                >
                  Refresh Data
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => analytics.clearAnalytics()}
                >
                  Clear Analytics
                </Button>
              </div>
            </div>

            {analyticsData ? (
              <>
                {/* Key Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{analyticsData.totalSessions}</div>
                      <p className="text-xs text-muted-foreground">
                        {analyticsData.weeklyData.length} in last 7 days
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Itineraries Created</CardTitle>
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{analyticsData.totalItineraries}</div>
                      <p className="text-xs text-muted-foreground">
                        Total user itineraries
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{analyticsData.completionRate}%</div>
                      <p className="text-xs text-muted-foreground">
                        {analyticsData.completedItineraries} completed tours
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Navigation Opens</CardTitle>
                      <Navigation className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {analyticsData.weeklyData.reduce((total: number, session: any) => 
                          total + session.events.filter((e: any) => e.type === 'navigation_opened').length, 0
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Last 7 days
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Most Selected Producers */}
                <Card>
                  <CardHeader>
                    <CardTitle>Most Popular Producers</CardTitle>
                    <CardDescription>Top 10 producers selected by users</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {analyticsData.mostSelectedProducers.slice(0, 10).map((item: any, index: number) => (
                        <div key={item.producer.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                            <div>
                              <p className="font-medium">{item.producer.name}</p>
                              <p className="text-sm text-muted-foreground">{item.producer.location.region}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{item.count} selections</p>
                            <p className="text-sm text-muted-foreground">
                              {item.producer.categories.slice(0, 2).join(', ')}
                            </p>
                          </div>
                        </div>
                      ))}
                      {analyticsData.mostSelectedProducers.length === 0 && (
                        <p className="text-muted-foreground text-center py-4">No producer selections yet</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Page Views */}
                <Card>
                  <CardHeader>
                    <CardTitle>Page Views</CardTitle>
                    <CardDescription>Most visited pages</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {analyticsData.pageViews.slice(0, 10).map((item: any) => (
                        <div key={item.path} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="font-medium">{item.path}</span>
                          <span className="font-semibold">{item.count} views</span>
                        </div>
                      ))}
                      {analyticsData.pageViews.length === 0 && (
                        <p className="text-muted-foreground text-center py-4">No page views tracked yet</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent User Activity</CardTitle>
                    <CardDescription>Latest user sessions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analyticsData.recentSessions.map((session: any) => (
                        <div key={session.id} className="p-3 border rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-sm font-medium">
                              Session {session.id.slice(-6)}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(session.startTime).toLocaleDateString()} {new Date(session.startTime).toLocaleTimeString()}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <span>Events: {session.events.length}</span>
                            <span>Duration: {session.endTime ? Math.round((session.endTime - session.startTime) / 1000 / 60) : 'Active'} min</span>
                          </div>
                          <div className="mt-2">
                            <div className="flex flex-wrap gap-1">
                              {Array.from(new Set(session.events.map((e: any) => e.type))).map((type, index) => (
                                <span key={`${type}-${index}`} className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                                  {String(type).replace('_', ' ')}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                      {analyticsData.recentSessions.length === 0 && (
                        <p className="text-muted-foreground text-center py-4">No recent activity</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="p-6">
                  <p className="text-center text-muted-foreground">Loading analytics data...</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Producers Tab */}
          <TabsContent value="producers" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Manage Producers</h2>
              <Button onClick={() => setIsAddingNew(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Producer
              </Button>
            </div>

            {/* Producer List */}
            <div className="grid gap-4">
              {producers.map((producer) => (
                <Card key={producer.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{producer.name}</CardTitle>
                        <CardDescription>{producer.categories.join(', ')}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingProducer(producer)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteProducer(producer.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>{producer.location.address}</p>
                      <p>{producer.phone}</p>
                      {producer.website && (
                        <p className="text-primary">{producer.website}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Edit/Add Producer Modal */}
            {(editingProducer || isAddingNew) && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <CardHeader>
                    <CardTitle>
                      {isAddingNew ? 'Add New Producer' : 'Edit Producer'}
                    </CardTitle>
                    <CardDescription>
                      {isAddingNew 
                        ? 'Enter the details for the new producer'
                        : 'Update the producer information'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Name</label>
                        <Input 
                          placeholder="Producer name"
                          defaultValue={editingProducer?.name}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Categories</label>
                        <Input 
                          placeholder="Categories (comma separated)"
                          defaultValue={editingProducer?.categories.join(', ')}
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="text-sm font-medium">Description</label>
                        <textarea 
                          className="w-full min-h-[100px] rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                          placeholder="Description"
                          defaultValue={editingProducer?.description}
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="text-sm font-medium">Address</label>
                        <Input 
                          placeholder="Full address"
                          defaultValue={editingProducer?.location.address}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Phone</label>
                        <Input 
                          placeholder="Phone number"
                          defaultValue={editingProducer?.phone}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Website</label>
                        <Input 
                          placeholder="Website URL"
                          defaultValue={editingProducer?.website}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setEditingProducer(null);
                          setIsAddingNew(false);
                        }}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                      <Button
                        onClick={() => handleSaveProducer(editingProducer || {} as Producer)}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">User Management</h2>
            </div>

            {/* User Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {analyticsData ? analyticsData.totalSessions : 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Unique sessions tracked
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {analyticsData ? analyticsData.weeklyData.length : 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Last 7 days
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Engaged Users</CardTitle>
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {analyticsData ? analyticsData.totalItineraries : 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Created itineraries
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* User Sessions */}
            <Card>
              <CardHeader>
                <CardTitle>Recent User Sessions</CardTitle>
                <CardDescription>
                  Detailed view of user activity and engagement
                </CardDescription>
              </CardHeader>
              <CardContent>
                {analyticsData && analyticsData.recentSessions.length > 0 ? (
                  <div className="space-y-4">
                    {analyticsData.recentSessions.map((session: any) => {
                      const itineraryEvents = session.events.filter((e: any) => 
                        ['itinerary_created', 'itinerary_started', 'itinerary_completed'].includes(e.type)
                      );
                      const producerEvents = session.events.filter((e: any) => 
                        ['producer_selected', 'producer_viewed', 'producer_visited'].includes(e.type)
                      );
                      
                      return (
                        <div key={session.id} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-medium">Session {session.id.slice(-6)}</h3>
                              <p className="text-sm text-muted-foreground">
                                {new Date(session.startTime).toLocaleString()}
                              </p>
                            </div>
                            <div className="text-right text-sm">
                              <p className="font-medium">
                                {session.events.length} total events
                              </p>
                              <p className="text-muted-foreground">
                                {session.endTime 
                                  ? `${Math.round((session.endTime - session.startTime) / 1000 / 60)}min session`
                                  : 'Active session'
                                }
                              </p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                            <div className="bg-blue-50 p-2 rounded">
                              <p className="font-medium text-blue-900">Page Views</p>
                              <p className="text-blue-700">
                                {session.events.filter((e: any) => e.type === 'page_view').length}
                              </p>
                            </div>
                            <div className="bg-green-50 p-2 rounded">
                              <p className="font-medium text-green-900">Itinerary Actions</p>
                              <p className="text-green-700">{itineraryEvents.length}</p>
                            </div>
                            <div className="bg-purple-50 p-2 rounded">
                              <p className="font-medium text-purple-900">Producer Actions</p>
                              <p className="text-purple-700">{producerEvents.length}</p>
                            </div>
                            <div className="bg-orange-50 p-2 rounded">
                              <p className="font-medium text-orange-900">Navigation</p>
                              <p className="text-orange-700">
                                {session.events.filter((e: any) => e.type === 'navigation_opened').length}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No user sessions recorded yet
                  </p>
                )}
              </CardContent>
            </Card>

            {/* User Behavior Insights */}
            <Card>
              <CardHeader>
                <CardTitle>User Behavior Insights</CardTitle>
                <CardDescription>
                  Analytics on how users interact with the application
                </CardDescription>
              </CardHeader>
              <CardContent>
                {analyticsData ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium mb-2">Engagement Metrics</h4>
                        <ul className="space-y-1 text-sm">
                          <li>• Average session: {
                            analyticsData.recentSessions.length > 0 
                              ? Math.round(analyticsData.recentSessions.reduce((total: number, session: any) => 
                                  total + (session.endTime ? (session.endTime - session.startTime) / 1000 / 60 : 0), 0
                                ) / analyticsData.recentSessions.filter((s: any) => s.endTime).length) 
                              : 0
                          } minutes</li>
                          <li>• Itinerary completion rate: {analyticsData.completionRate}%</li>
                          <li>• Navigation usage: {
                            analyticsData.weeklyData.reduce((total: number, session: any) => 
                              total + session.events.filter((e: any) => e.type === 'navigation_opened').length, 0
                            )
                          } times this week</li>
                        </ul>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium mb-2">Popular Features</h4>
                        <ul className="space-y-1 text-sm">
                          <li>• Most viewed page: {analyticsData.pageViews[0]?.path || 'None'}</li>
                          <li>• Top producer: {analyticsData.mostSelectedProducers[0]?.producer?.name || 'None'}</li>
                          <li>• Total producer selections: {
                            analyticsData.mostSelectedProducers.reduce((total: number, item: any) => total + item.count, 0)
                          }</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-4">
                    Loading user behavior data...
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Application Settings</h2>
            </div>

            {/* Analytics Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Analytics Configuration</CardTitle>
                <CardDescription>
                  Manage analytics tracking and data retention
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Data Retention Period</label>
                    <select className="w-full p-2 border rounded-md">
                      <option value="7">7 days</option>
                      <option value="30" selected>30 days</option>
                      <option value="90">90 days</option>
                      <option value="365">1 year</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Session Timeout</label>
                    <select className="w-full p-2 border rounded-md">
                      <option value="30">30 minutes</option>
                      <option value="60" selected>1 hour</option>
                      <option value="120">2 hours</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      const data = analytics.getAnalytics();
                      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `analytics-${new Date().toISOString().split('T')[0]}.json`;
                      a.click();
                    }}
                  >
                    Export Analytics Data
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      if (confirm('Are you sure you want to clear all analytics data? This cannot be undone.')) {
                        analytics.clearAnalytics();
                        loadAnalytics();
                      }
                    }}
                  >
                    Clear All Data
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Feature Flags */}
            <Card>
              <CardHeader>
                <CardTitle>Feature Flags</CardTitle>
                <CardDescription>
                  Enable or disable application features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label className="flex items-center gap-3">
                      <input type="checkbox" className="rounded" defaultChecked />
                      <div>
                        <span className="text-sm font-medium">Page View Tracking</span>
                        <p className="text-xs text-muted-foreground">Track user navigation</p>
                      </div>
                    </label>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" className="rounded" defaultChecked />
                      <div>
                        <span className="text-sm font-medium">Producer Analytics</span>
                        <p className="text-xs text-muted-foreground">Track producer interactions</p>
                      </div>
                    </label>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" className="rounded" defaultChecked />
                      <div>
                        <span className="text-sm font-medium">Itinerary Tracking</span>
                        <p className="text-xs text-muted-foreground">Track itinerary creation and completion</p>
                      </div>
                    </label>
                  </div>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3">
                      <input type="checkbox" className="rounded" />
                      <div>
                        <span className="text-sm font-medium">AI Recommendations</span>
                        <p className="text-xs text-muted-foreground">Enable AI-powered suggestions</p>
                      </div>
                    </label>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" className="rounded" />
                      <div>
                        <span className="text-sm font-medium">User Reviews</span>
                        <p className="text-xs text-muted-foreground">Allow users to rate producers</p>
                      </div>
                    </label>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" className="rounded" />
                      <div>
                        <span className="text-sm font-medium">Social Sharing</span>
                        <p className="text-xs text-muted-foreground">Enable social media sharing</p>
                      </div>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* API Configuration */}
            <Card>
              <CardHeader>
                <CardTitle>API Configuration</CardTitle>
                <CardDescription>
                  Configure external service integrations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium mb-2 block">OpenAI API Key</label>
                    <Input 
                      placeholder="sk-..." 
                      type="password"
                      className="font-mono"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      For AI-powered recommendations and content
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Mapbox API Key</label>
                    <Input 
                      placeholder="pk...." 
                      type="password"
                      className="font-mono"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      For enhanced mapping and geocoding features
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Google Analytics ID</label>
                    <Input 
                      placeholder="G-XXXXXXXXXX" 
                      className="font-mono"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Optional: For additional analytics tracking
                    </p>
                  </div>
                </div>
                <Button className="w-full sm:w-auto">
                  Save API Configuration
                </Button>
              </CardContent>
            </Card>

            {/* System Information */}
            <Card>
              <CardHeader>
                <CardTitle>System Information</CardTitle>
                <CardDescription>
                  Application status and performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Application</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>Version: 1.0.0</li>
                      <li>Build: Production</li>
                      <li>Last deployed: {new Date().toLocaleDateString()}</li>
                      <li>Analytics version: {analyticsData?.version || '1.0'}</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Storage Usage</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>Analytics data: {
                        analyticsData ? 
                          `${Math.round(JSON.stringify(analyticsData).length / 1024)}KB` 
                          : '0KB'
                      }</li>
                      <li>Session storage: {Object.keys(sessionStorage).length} items</li>
                      <li>Local storage: {Object.keys(localStorage).length} items</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};