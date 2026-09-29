import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { formatCurrency } from '@/utils/formatCurrency.js';
import pb from '@/lib/pocketbaseClient';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import OperationForm from '@/components/OperationForm.jsx';

const AdminOperationsPage = () => {
  const [operations, setOperations] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOperation, setEditingOperation] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchOperations();
  }, []);

  const fetchOperations = async () => {
    try {
      const operationsList = await pb.collection('operations').getFullList({
        sort: 'category,name',
        $autoCancel: false
      });
      setOperations(operationsList);
    } catch (error) {
      console.error('Error fetching operations:', error);
    }
  };

  const openAddDialog = () => {
    setEditingOperation(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (operation) => {
    setEditingOperation(operation);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      if (editingOperation) {
        await pb.collection('operations').update(editingOperation.id, data, { $autoCancel: false });
        toast.success('Operation updated successfully');
      } else {
        await pb.collection('operations').create(data, { $autoCancel: false });
        toast.success('Operation added successfully');
      }
      setIsDialogOpen(false);
      fetchOperations();
    } catch (error) {
      console.error('Error saving operation:', error);
      toast.error('Failed to save operation');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await pb.collection('operations').delete(deleteTarget.id, { $autoCancel: false });
      toast.success(`"${deleteTarget.name}" deleted`);
      setDeleteTarget(null);
      fetchOperations();
    } catch (error) {
      console.error('Error deleting operation:', error);
      toast.error('Failed to delete operation');
    }
  };

  return (
    <>
      <Helmet>
        <title>Manage Operations | Admin</title>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <section className="py-12 bg-muted min-h-[calc(100vh-80px)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-4xl font-bold text-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>
                Operations Catalog
              </h1>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2" onClick={openAddDialog}>
                    <Plus className="w-4 h-4" />
                    Add Operation
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{editingOperation ? 'Edit Operation' : 'Add New Operation'}</DialogTitle>
                  </DialogHeader>
                  <OperationForm
                    key={editingOperation?.id || 'new'}
                    initialData={editingOperation}
                    onSubmit={handleSubmit}
                    onCancel={() => setIsDialogOpen(false)}
                    isLoading={isSubmitting}
                  />
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {operations.map(operation => (
                <Card key={operation.id} className="border-border">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                        {operation.category}
                      </span>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => openEditDialog(operation)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => setDeleteTarget(operation)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">{operation.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{operation.description}</p>
                    <p className="text-lg font-bold text-primary">{formatCurrency(operation.price)}</p>
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
            <DialogTitle>Delete Operation</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-4 justify-end mt-4">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} className="gap-2">
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminOperationsPage;
