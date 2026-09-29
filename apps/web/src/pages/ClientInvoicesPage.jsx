import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, Download } from 'lucide-react';
import { formatCurrency } from '@/utils/formatCurrency.js';
import { formatDate } from '@/utils/formatDate.js';
import { useAuth } from '@/hooks/useAuth.js';
import pb from '@/lib/pocketbaseClient';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const ClientInvoicesPage = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    fetchInvoices();
  }, [currentUser]);

  const fetchInvoices = async () => {
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
          return;
        }
      } else {
        clientId = clients[0].id;
      }

      const invoicesList = await pb.collection('invoices').getFullList({
        filter: `clientId = "${clientId}"`,
        sort: '-invoice_date',
        $autoCancel: false
      });

      setInvoices(invoicesList);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Mes factures | BAVET</title>
        <meta name="description" content="Consultez vos factures et votre historique de paiement." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <section className="py-12 bg-muted min-h-[calc(100vh-80px)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                Mes factures
              </h1>
              <p className="text-muted-foreground">Consultez votre historique de facturation et le statut des paiements</p>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <Skeleton className="h-6 w-32 mb-2" />
                      <Skeleton className="h-4 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : invoices.length === 0 ? (
              <Card className="border-border">
                <CardContent className="p-12 text-center">
                  <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">Aucune facture</h3>
                  <p className="text-muted-foreground">Vos factures apparaîtront ici après une prestation</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {invoices.map((invoice, index) => (
                  <motion.div
                    key={invoice.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Link to={`/client/invoices/${invoice.id}`}>
                      <Card className="border-border cursor-pointer hover:shadow-lg transition-all duration-300">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-4 mb-2">
                                <h3 className="text-xl font-semibold text-foreground">
                                  {invoice.invoice_number}
                                </h3>
                                <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                                  invoice.status === 'paid' ? 'bg-green-100 text-green-700' :
                                  invoice.status === 'overdue' ? 'bg-red-100 text-red-700' :
                                  invoice.status === 'sent' ? 'bg-blue-100 text-blue-700' :
                                  'bg-yellow-100 text-yellow-700'
                                }`}>
                                  {invoice.status}
                                </span>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                  <div>
                                  <p className="text-muted-foreground">Date</p>
                                  <p className="font-medium text-foreground">{formatDate(invoice.invoice_date)}</p>
                                </div>
                                {invoice.due_date && (
                                  <div>
                                    <p className="text-muted-foreground">Échéance</p>
                                    <p className="font-medium text-foreground">{formatDate(invoice.due_date)}</p>
                                  </div>
                                )}
                                <div>
                                  <p className="text-muted-foreground">Montant</p>
                                  <p className="font-medium text-foreground">{formatCurrency(invoice.total_amount)}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
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

export default ClientInvoicesPage;