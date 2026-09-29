import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Rabbit as Horse, FileText, Calendar, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth.js';
import { formatCurrency } from '@/utils/formatCurrency.js';
import { formatDate } from '@/utils/formatDate.js';
import pb from '@/lib/pocketbaseClient';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const ClientDashboardPage = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ horses: 0, invoices: 0, pendingAmount: 0 });
  const [recentHorses, setRecentHorses] = useState([]);
  const [recentInvoices, setRecentInvoices] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Get client record
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
            return;
          }
        } else {
          clientId = clients[0].id;
        }

        // Fetch horses
        const horses = await pb.collection('horses').getFullList({
          filter: `clientId = "${clientId}"`,
          $autoCancel: false
        });

        // Fetch invoices
        const invoices = await pb.collection('invoices').getFullList({
          filter: `clientId = "${clientId}"`,
          sort: '-invoice_date',
          $autoCancel: false
        });

        const pendingInvoices = invoices.filter(inv => inv.status !== 'paid');
        const pendingAmount = pendingInvoices.reduce((sum, inv) => sum + inv.total_amount, 0);

        setStats({
          horses: horses.length,
          invoices: invoices.length,
          pendingAmount
        });

        setRecentHorses(horses.slice(0, 3));
        setRecentInvoices(invoices.slice(0, 3));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  return (
    <>
      <Helmet>
        <title>Client Dashboard | BAVET</title>
        <meta name="description" content="Manage your horses, view medical records, and track invoices." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <section className="py-12 bg-muted">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl font-bold text-foreground mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                Welcome back, {currentUser?.name}
              </h1>
              <p className="text-muted-foreground">Here's an overview of your account</p>
            </motion.div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                {[1, 2, 3].map(i => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <Skeleton className="h-12 w-12 rounded-xl mb-4" />
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-8 w-16" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <Card className="border-border">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Total Horses</p>
                          <p className="text-3xl font-bold text-foreground">{stats.horses}</p>
                        </div>
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                          <Horse className="w-6 h-6 text-primary" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Card className="border-border">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Total Invoices</p>
                          <p className="text-3xl font-bold text-foreground">{stats.invoices}</p>
                        </div>
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                          <FileText className="w-6 h-6 text-primary" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Card className="border-border">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Pending Amount</p>
                          <p className="text-3xl font-bold text-foreground">{formatCurrency(stats.pendingAmount)}</p>
                        </div>
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-primary" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card className="border-border">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Recent Horses</CardTitle>
                      <Link to="/client/horses">
                        <Button variant="ghost" size="sm" className="gap-2">
                          View All
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                          <Skeleton key={i} className="h-16 w-full" />
                        ))}
                      </div>
                    ) : recentHorses.length === 0 ? (
                      <div className="text-center py-8">
                        <Horse className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground">No horses registered yet</p>
                        <Link to="/client/horses">
                          <Button variant="outline" className="mt-4">Add Your First Horse</Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {recentHorses.map(horse => (
                          <Link key={horse.id} to={`/client/horse/${horse.id}`}>
                            <div className="p-4 rounded-lg border border-border hover:bg-muted transition-colors">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-semibold text-foreground">{horse.name}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {horse.breed} • {horse.age} years
                                  </p>
                                </div>
                                <ArrowRight className="w-5 h-5 text-muted-foreground" />
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <Card className="border-border">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Recent Invoices</CardTitle>
                      <Link to="/client/invoices">
                        <Button variant="ghost" size="sm" className="gap-2">
                          View All
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                          <Skeleton key={i} className="h-16 w-full" />
                        ))}
                      </div>
                    ) : recentInvoices.length === 0 ? (
                      <div className="text-center py-8">
                        <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground">No invoices yet</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {recentInvoices.map(invoice => (
                          <div key={invoice.id} className="p-4 rounded-lg border border-border">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold text-foreground">{invoice.invoice_number}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {formatDate(invoice.invoice_date)}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-foreground">{formatCurrency(invoice.total_amount)}</p>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  invoice.status === 'paid' ? 'bg-green-100 text-green-700' :
                                  invoice.status === 'overdue' ? 'bg-red-100 text-red-700' :
                                  'bg-yellow-100 text-yellow-700'
                                }`}>
                                  {invoice.status}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default ClientDashboardPage;