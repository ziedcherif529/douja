import React from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent } from '@/components/ui/card';
import { Activity } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const AdminMedicalPage = () => {
  return (
    <>
      <Helmet>
        <title>Medical Records | Admin</title>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <section className="py-12 bg-muted min-h-[calc(100vh-80px)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-foreground mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>
              Medical Records
            </h1>

            <Card className="border-border">
              <CardContent className="p-12 text-center">
                <Activity className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Medical Records Management</h3>
                <p className="text-muted-foreground">View and manage medical records for all horses</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default AdminMedicalPage;