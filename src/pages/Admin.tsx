import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Users, MapPin, Settings, LogOut, Plus, Edit, Trash2, Save, X } from 'lucide-react';
import type { Producer } from '@/types';

interface AdminPanelProps {}

export const Admin: React.FC<AdminPanelProps> = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [producers, setProducers] = useState<Producer[]>([]);
  const [editingProducer, setEditingProducer] = useState<Producer | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    const authStatus = sessionStorage.getItem('adminAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      loadProducers();
    }
  }, []);

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

  // Handle login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple password check - in production, this should be server-side
    if (password === 'admin2024') {
      setIsAuthenticated(true);
      sessionStorage.setItem('adminAuthenticated', 'true');
      loadProducers();
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
        <Tabs defaultValue="producers" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
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
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  View and manage user accounts and permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  User management features coming soon...
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Application Settings</CardTitle>
                <CardDescription>
                  Configure application settings and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">API Configuration</h3>
                  <div className="space-y-2">
                    <Input placeholder="OpenAI API Key" type="password" />
                    <Input placeholder="Mapbox API Key" type="password" />
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Feature Flags</h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">Enable AI Recommendations</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">Enable User Reviews</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">Enable Social Sharing</span>
                    </label>
                  </div>
                </div>
                <Button className="w-full sm:w-auto">
                  Save Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};