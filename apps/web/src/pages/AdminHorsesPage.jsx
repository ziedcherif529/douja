import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent } from '@/components/ui/card';
import { Rabbit as Horse } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const AdminHorsesPage = () => {
  const [horses, setHorses] = useState([]);

  useEffect(() => {
    const fetchHorses = async () => {
      try {
        const horsesList = await pb.collection('horses').getFullList({
          expand: 'clientId',
          $autoCancel: false
        });
        setHorses(horsesList);
      } catch (error) {
        console.error('Error fetching horses:', error);
      }
    };

    fetchHorses();
  }, []);

  return (
    <>
      <Helmet>
        <title>Manage Horses | Admin</title>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <section className="py-12 bg-muted min-h-[calc(100vh-80px)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-foreground mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>
              All Horses
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {horses.map(horse => (
                <Card key={horse.id} className="border-border">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-semibold text-foreground">{horse.name}</h3>
                      <Horse className="w-6 h-6 text-primary" />
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>Owner: {horse.expand?.clientId?.name}</p>
                      {horse.breed && <p>Breed: {horse.breed}</p>}
                      {horse.age && <p>Age: {horse.age} years</p>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default AdminHorsesPage;