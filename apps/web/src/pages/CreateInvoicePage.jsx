import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { generateInvoiceNumber } from '@/utils/generateInvoiceNumber.js';
import { generateInvoicePDF } from '@/utils/generateInvoicePDF.js';
import { useInvoiceCalculations } from '@/hooks/useInvoiceCalculations.js';
import pb from '@/lib/pocketbaseClient';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const CreateInvoicePage = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [horses, setHorses] = useState([]);
  const [operations, setOperations] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedHorse, setSelectedHorse] = useState('');
  const [items, setItems] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { subtotal, total } = useInvoiceCalculations(items);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientsList, operationsList] = await Promise.all([
          pb.collection('clients').getFullList({ sort: 'name', $autoCancel: false }),
          pb.collection('operations').getFullList({ sort: 'name', $autoCancel: false })
        ]);
        setClients(clientsList);
        setOperations(operationsList);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedClient) {
      const fetchHorses = async () => {
        try {
          const horsesList = await pb.collection('horses').getFullList({
            filter: `clientId = "${selectedClient}"`,
            sort: 'name',
            $autoCancel: false
          });
          setHorses(horsesList);
        } catch (error) {
          console.error('Error fetching horses:', error);
        }
      };

      fetchHorses();
    }
  }, [selectedClient]);

  const addItem = () => {
    setItems([...items, { operationId: '', quantity: 1, unit_price: 0, line_total: 0 }]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;

    if (field === 'operationId') {
      const operation = operations.find(op => op.id === value);
      if (operation) {
        newItems[index].unit_price = operation.price;
        newItems[index].line_total = operation.price * newItems[index].quantity;
      }
    } else if (field === 'quantity') {
      newItems[index].line_total = newItems[index].unit_price * value;
    }

    setItems(newItems);
  };

  const handleSubmit = async () => {
    if (!selectedClient || items.length === 0) {
      toast.error('Please select a client and add at least one item');
      return;
    }

    setIsSubmitting(true);
    try {
      const invoiceNumber = generateInvoiceNumber();
      const invoiceDate = new Date().toISOString().split('T')[0];

      const invoice = await pb.collection('invoices').create({
        clientId: selectedClient,
        horseId: selectedHorse || null,
        invoice_number: invoiceNumber,
        invoice_date: invoiceDate,
        subtotal,
        total_amount: total,
        status: 'draft'
      }, { $autoCancel: false });

      for (const item of items) {
        const operation = operations.find(op => op.id === item.operationId);
        await pb.collection('invoice_items').create({
          invoiceId: invoice.id,
          operationId: item.operationId,
          description: operation?.name || '',
          quantity: item.quantity,
          unit_price: item.unit_price,
          line_total: item.line_total
        }, { $autoCancel: false });
      }

      const [clientData, horseData] = await Promise.all([
        pb.collection('clients').getOne(selectedClient, { $autoCancel: false }),
        selectedHorse
          ? pb.collection('horses').getOne(selectedHorse, { $autoCancel: false })
          : Promise.resolve(null)
      ]);

      generateInvoicePDF({
        invoice,
        client: clientData,
        horse: horseData,
        items,
        operations,
      });

      toast.success('Invoice created successfully');
      navigate(`/admin/invoices/${invoice.id}`);
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast.error('Failed to create invoice');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Nouvelle facture | Admin</title>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <section className="py-12 bg-muted min-h-[calc(100vh-80px)]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-foreground mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>
              Nouvelle facture
            </h1>

            <Card className="border-border mb-6">
              <CardHeader>
                <CardTitle>Informations client</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Client *</Label>
                  <Select value={selectedClient} onValueChange={setSelectedClient}>
                    <SelectTrigger className="text-foreground">
                      <SelectValue placeholder="Sélectionner un client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map(client => (
                        <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Cheval (optionnel)</Label>
                  <Select value={selectedHorse} onValueChange={setSelectedHorse}>
                    <SelectTrigger className="text-foreground">
                      <SelectValue placeholder="Sélectionner un cheval" />
                    </SelectTrigger>
                    <SelectContent>
                      {horses.map(horse => (
                        <SelectItem key={horse.id} value={horse.id}>{horse.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Articles</CardTitle>
                  <Button onClick={addItem} size="sm" className="gap-2">
                    <Plus className="w-4 h-4" />
                    Ajouter
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {items.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">Aucun article ajouté</p>
                ) : (
                  <div className="space-y-4">
                    {items.map((item, index) => (
                      <div key={index} className="flex gap-4 items-end">
                        <div className="flex-1 space-y-2">
                          <Label>Opération</Label>
                          <Select
                            value={item.operationId}
                            onValueChange={(value) => updateItem(index, 'operationId', value)}
                          >
                            <SelectTrigger className="text-foreground">
                              <SelectValue placeholder="Choisir une opération" />
                            </SelectTrigger>
                            <SelectContent>
                              {operations.map(op => (
                                <SelectItem key={op.id} value={op.id}>{op.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="w-24 space-y-2">
                          <Label>Qté</Label>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                            className="text-foreground"
                          />
                        </div>
                        <div className="w-32 space-y-2">
                          <Label>Total</Label>
                          <Input
                            value={item.line_total.toFixed(2)}
                            readOnly
                            className="text-foreground bg-muted"
                          />
                        </div>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => removeItem(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-border mb-6">
              <CardContent className="p-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-xl font-bold text-foreground pt-2 border-t border-border">
                    <span>Total :</span>
                    <span>{total.toFixed(2)} TND</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button onClick={() => navigate('/admin/invoices')} variant="outline" className="flex-1">
                Annuler
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting} className="flex-1">
                {isSubmitting ? 'Création...' : 'Créer la facture'}
              </Button>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default CreateInvoicePage;