import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Rabbit as Horse, FileText, DollarSign } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({ clients: 0, horses: 0, invoices: 0, revenue: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const clients = await pb.collection('clients').getFullList({ $autoCancel: false });
        const horses = await pb.collection('horses').getFullList({ $autoCancel: false });
        const invoices = await pb.collection('invoices').getFullList({ $autoCancel: false });
        const revenue = invoices.reduce((sum, inv) => sum + (inv.total_amount || 0), 0);

        setStats({
          clients: clients.length,
          horses: horses.length,
          invoices: invoices.length,
          revenue
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { icon: Users, label: 'Total Clients', value: stats.clients, color: 'bg-blue-500' },
    { icon: Horse, label: 'Total Horses', value: stats.horses, color: 'bg-green-500' },
    { icon: FileText, label: 'Total Invoices', value: stats.invoices, color: 'bg-purple-500' },
    { icon: DollarSign, label: 'Total Revenue', value: `${stats.revenue.toFixed(2)} TND`, color: 'bg-yellow-500' }
  ];

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | BAVET</title>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <section className="py-12 bg-muted min-h-[calc(100vh-80px)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-foreground mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>
              Admin Dashboard
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statCards.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="border-border">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                          <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                        </div>
                        <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                          <stat.icon className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default AdminDashboardPage;