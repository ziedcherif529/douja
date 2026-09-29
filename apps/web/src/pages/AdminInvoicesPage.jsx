import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Plus, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/utils/formatCurrency.js';
import { formatDate } from '@/utils/formatDate.js';
import pb from '@/lib/pocketbaseClient';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const STATUS_LABELS = {
  draft: 'Brouillon',
  sent: 'Envoyée',
  paid: 'Payée',
  overdue: 'En retard',
  cancelled: 'Annulée',
};

const AdminInvoicesPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const invoicesList = await pb.collection('invoices').getFullList({
        sort: '-invoice_date',
        expand: 'clientId',
        $autoCancel: false
      });
      setInvoices(invoicesList);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const items = await pb.collection('invoice_items').getFullList({
        filter: `invoiceId = "${deleteTarget.id}"`,
        $autoCancel: false
      });
      for (const item of items) {
        await pb.collection('invoice_items').delete(item.id, { $autoCancel: false });
      }
      await pb.collection('invoices').delete(deleteTarget.id, { $autoCancel: false });
      setDeleteTarget(null);
      fetchInvoices();
    } catch (error) {
      console.error('Error deleting invoice:', error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Factures | Admin</title>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <section className="py-12 bg-muted min-h-[calc(100vh-80px)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-4xl font-bold text-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>
                Factures
              </h1>
              <Link to="/admin/create-invoice">
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Nouvelle facture
                </Button>
              </Link>
            </div>

            <div className="space-y-4">
              {invoices.map(invoice => (
                <Card key={invoice.id} className="border-border">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <Link to={`/admin/invoices/${invoice.id}`} className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-xl font-semibold text-foreground mb-1">{invoice.invoice_number}</h3>
                            <p className="text-sm text-muted-foreground">
                              Client : {invoice.expand?.clientId?.name}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-foreground">{formatCurrency(invoice.total_amount)}</p>
                            <p className="text-sm text-muted-foreground">{formatDate(invoice.invoice_date)}</p>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              invoice.status === 'paid' ? 'bg-green-100 text-green-700' :
                              invoice.status === 'overdue' ? 'bg-red-100 text-red-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {STATUS_LABELS[invoice.status] || invoice.status}
                            </span>
                          </div>
                        </div>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-4 text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                        onClick={(e) => { e.preventDefault(); setDeleteTarget(invoice); }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>

      <Dialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Supprimer la facture</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer la facture <strong>{deleteTarget?.invoice_number}</strong> ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-4 justify-end mt-4">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDelete} className="gap-2">
              <Trash2 className="w-4 h-4" />
              Supprimer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminInvoicesPage;
