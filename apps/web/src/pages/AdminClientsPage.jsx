import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Plus, Mail, Phone, Trash2, User, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import ClientForm from '@/components/ClientForm.jsx';

const AdminClientsPage = () => {
  const [clients, setClients] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const clientsList = await pb.collection('clients').getFullList({
        expand: 'userId',
        $autoCancel: false
      });
      setClients(clientsList);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const handleAddClient = async (data) => {
    setIsSubmitting(true);
    try {
      const { password, ...clientData } = data;
      const user = await pb.collection('users').create({
        email: data.email,
        password: password,
        passwordConfirm: password,
        name: data.name,
        role: 'client',
        emailVisibility: true
      }, { $autoCancel: false });

      await pb.collection('clients').create({
        ...clientData,
        userId: user.id
      }, { $autoCancel: false });

      toast.success(`Client "${data.name}" added successfully. They can log in with the password you set.`);
      setIsDialogOpen(false);
      fetchClients();
    } catch (error) {
      console.error('Error adding client:', error);
      toast.error(error.data?.message || 'Failed to add client');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClient = async (client) => {
    try {
      await pb.collection('clients').delete(client.id, { $autoCancel: false });
      if (client.userId) {
        await pb.collection('users').delete(client.userId, { $autoCancel: false }).catch(() => {});
      }
      toast.success(`Client "${client.name}" removed successfully.`);
      setDeleteTarget(null);
      fetchClients();
    } catch (error) {
      console.error('Error deleting client:', error);
      toast.error('Failed to remove client. They may have horses or invoices linked.');
    }
  };

  return (
    <>
      <Helmet>
        <title>Manage Clients | Admin</title>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <section className="py-12 bg-muted min-h-[calc(100vh-80px)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-4xl font-bold text-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>
                Clients
              </h1>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Client
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Client</DialogTitle>
                    <DialogDescription>
                      Create a client account. Share the password with the client so they can log in.
                    </DialogDescription>
                  </DialogHeader>
                  <ClientForm
                    onSubmit={handleAddClient}
                    onCancel={() => setIsDialogOpen(false)}
                    isLoading={isSubmitting}
                  />
                </DialogContent>
              </Dialog>
            </div>

            {/* Delete confirmation dialog */}
            <Dialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Remove Client</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to remove <strong>{deleteTarget?.name}</strong>? 
                    This will permanently delete their user account and client profile. 
                    Their horses and invoices will also be affected.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex gap-4 justify-end mt-4">
                  <Button variant="outline" onClick={() => setDeleteTarget(null)}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={() => handleDeleteClient(deleteTarget)} className="gap-2">
                    <Trash2 className="w-4 h-4" />
                    Remove Client
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clients.map(client => (
                <Card key={client.id} className="border-border">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-semibold text-foreground">{client.name}</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => setDeleteTarget(client)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="w-4 h-4" />
                        {client.email}
                      </div>
                      {client.phone && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="w-4 h-4" />
                          {client.phone}
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        Created {new Date(client.created).toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {clients.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No clients yet</h3>
                  <p className="text-muted-foreground">Click "Add Client" to create the first client account.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default AdminClientsPage;