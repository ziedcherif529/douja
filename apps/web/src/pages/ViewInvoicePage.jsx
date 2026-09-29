import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Loader2, Trash2, Save } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import InvoicePreview from '@/components/InvoicePreview.jsx';
import PDFExport from '@/components/PDFExport.jsx';

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Brouillon' },
  { value: 'sent', label: 'Envoyée' },
  { value: 'paid', label: 'Payée' },
  { value: 'overdue', label: 'En retard' },
  { value: 'cancelled', label: 'Annulée' },
];

const ViewInvoicePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [invoice, setInvoice] = useState(null);
  const [client, setClient] = useState(null);
  const [horse, setHorse] = useState(null);
  const [items, setItems] = useState([]);
  const [operations, setOperations] = useState([]);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const invoiceData = await pb.collection('invoices').getOne(id, {
          expand: 'clientId,horseId',
          $autoCancel: false
        });
        setInvoice(invoiceData);
        setStatus(invoiceData.status);
        setClient(invoiceData.expand?.clientId);
        setHorse(invoiceData.expand?.horseId || null);

        const [itemsList, operationsList] = await Promise.all([
          pb.collection('invoice_items').getFullList({
            filter: `invoiceId = "${id}"`,
            $autoCancel: false
          }),
          pb.collection('operations').getFullList({
            sort: 'name',
            $autoCancel: false
          })
        ]);
        setItems(itemsList);
        setOperations(operationsList);
      } catch (error) {
        console.error('Error fetching invoice:', error);
        setError('Failed to load invoice');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleStatusUpdate = async () => {
    setSaving(true);
    try {
      await pb.collection('invoices').update(id, { status }, { $autoCancel: false });
      setInvoice(prev => ({ ...prev, status }));
      toast.success('Statut mis à jour');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      for (const item of items) {
        await pb.collection('invoice_items').delete(item.id, { $autoCancel: false });
      }
      await pb.collection('invoices').delete(id, { $autoCancel: false });
      toast.success('Facture supprimée');
      navigate('/admin/invoices');
    } catch (error) {
      console.error('Error deleting invoice:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <p className="text-destructive">{error || 'Invoice not found'}</p>
          <Button onClick={() => navigate(-1)} variant="outline" className="mt-4">
            Retour
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Facture {invoice.invoice_number} | BAVET</title>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <section className="py-12 bg-muted min-h-[calc(100vh-80px)]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-4">
              <Button onClick={() => navigate(-1)} variant="outline" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Retour
              </Button>
              <div className="flex items-center gap-2">
                <PDFExport
                  invoice={invoice}
                  client={client}
                  horse={horse}
                  items={items}
                  operations={operations}
                />
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => setShowDelete(true)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-8 p-4 bg-card rounded-lg border border-border">
              <label className="text-sm font-medium text-foreground">Statut :</label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-40 text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {status !== invoice.status && (
                <Button onClick={handleStatusUpdate} disabled={saving} size="sm" className="gap-2">
                  <Save className="w-4 h-4" />
                  {saving ? 'Enregistrement...' : 'Enregistrer'}
                </Button>
              )}
            </div>

            <InvoicePreview
              invoice={invoice}
              client={client}
              horse={horse}
              items={items}
              operations={operations}
            />
          </div>
        </section>

        <Footer />
      </div>

      <Dialog open={showDelete} onOpenChange={setShowDelete}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Supprimer la facture</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer la facture <strong>{invoice?.invoice_number}</strong> ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-4 justify-end mt-4">
            <Button variant="outline" onClick={() => setShowDelete(false)}>
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

export default ViewInvoicePage;
