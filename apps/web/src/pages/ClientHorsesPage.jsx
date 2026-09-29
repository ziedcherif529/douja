import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Rabbit as Horse, Plus, Search, Eye } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth.js';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import HorseForm from '@/components/HorseForm.jsx';

const ClientHorsesPage = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [horses, setHorses] = useState([]);
  const [filteredHorses, setFilteredHorses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [clientId, setClientId] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchHorses();
  }, [currentUser]);

  useEffect(() => {
    const filtered = horses.filter(horse =>
      horse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      horse.breed?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredHorses(filtered);
  }, [searchTerm, horses]);

  const fetchHorses = async () => {
    try {
      setLoading(true);
      const clients = await pb.collection('clients').getFullList({
        filter: `userId = "${currentUser.id}"`,
        $autoCancel: false
      });

      let clientId;
      if (clients.length === 0) {
        try {
          const newClient = await pb.collection('clients').create({
            userId: currentUser.id,
            name: currentUser.name || '',
            email: currentUser.email
          }, { $autoCancel: false });
          clientId = newClient.id;
        } catch (createError) {
          console.error('Failed to auto-create client record:', createError);
          setLoading(false);
          toast.error('Client profile not found. Please contact support.');
          return;
        }
      } else {
        clientId = clients[0].id;
      }

      setClientId(clientId);

      const horsesList = await pb.collection('horses').getFullList({
        filter: `clientId = "${clientId}"`,
        $autoCancel: false
      });

      setHorses(horsesList);
      setFilteredHorses(horsesList);
    } catch (error) {
      console.error('Error fetching horses:', error);
      toast.error('Failed to load horses');
    } finally {
      setLoading(false);
    }
  };

  const handleAddHorse = async (data) => {
    setIsSubmitting(true);
    try {
      if (!clientId) {
        throw new Error('Client profile not found. Cannot add horse.');
      }

      await pb.collection('horses').create({
        ...data,
        clientId
      }, { $autoCancel: false });

      toast.success('Horse added successfully');
      setIsDialogOpen(false);
      fetchHorses();
    } catch (error) {
      console.error('Error adding horse:', error);
      const errorMsg = error.response?.message || error.message || 'Failed to add horse';
      toast.error(`Error: ${errorMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>My Horses | BAVET</title>
        <meta name="description" content="View and manage your horses' information and medical records." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <section className="py-12 bg-muted min-h-[calc(100vh-80px)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                  My Horses
                </h1>
                <p className="text-muted-foreground">Manage your horses and their medical records</p>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2" disabled={!clientId}>
                    <Plus className="w-4 h-4" />
                    Add Horse
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Horse</DialogTitle>
                  </DialogHeader>
                  <HorseForm
                    onSubmit={handleAddHorse}
                    onCancel={() => setIsDialogOpen(false)}
                    isLoading={isSubmitting}
                  />
                </DialogContent>
              </Dialog>
            </div>

            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search horses by name or breed..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-foreground"
                />
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <Skeleton className="h-6 w-32 mb-4" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-24" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredHorses.length === 0 ? (
              <Card className="border-border">
                <CardContent className="p-12 text-center">
                  <Horse className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {searchTerm ? 'No horses found' : 'No horses yet'}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {searchTerm ? 'Try adjusting your search' : 'Add your first horse to get started'}
                  </p>
                  {!searchTerm && clientId && (
                    <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
                      <Plus className="w-4 h-4" />
                      Add Your First Horse
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredHorses.map((horse, index) => (
                  <motion.div
                    key={horse.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="border-border hover:shadow-lg transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-semibold text-foreground mb-1">
                              {horse.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {horse.breed || 'Breed not specified'}
                            </p>
                          </div>
                          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                            <Horse className="w-6 h-6 text-primary" />
                          </div>
                        </div>
                        <div className="space-y-2 mb-4">
                          {horse.age && (
                            <p className="text-sm text-muted-foreground">Age: {horse.age} years</p>
                          )}
                          {horse.color && (
                            <p className="text-sm text-muted-foreground">Color: {horse.color}</p>
                          )}
                          {horse.microchip && (
                            <p className="text-sm text-muted-foreground">Microchip: {horse.microchip}</p>
                          )}
                        </div>
                        <Link to={`/client/horse/${horse.id}`}>
                          <Button variant="outline" className="w-full gap-2">
                            <Eye className="w-4 h-4" />
                            View Details
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default ClientHorsesPage;