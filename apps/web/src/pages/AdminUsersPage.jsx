import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Shield, User, Mail, Calendar, BadgeCheck } from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import pb from '@/lib/pocketbaseClient';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm();
  const newPassword = watch('password', '');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const usersList = await pb.collection('users').getFullList({
        sort: '-created',
        $autoCancel: false
      });
      setUsers(usersList);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleCreateAdmin = async (data) => {
    setIsSubmitting(true);
    try {
      await pb.collection('users').create({
        email: data.email,
        password: data.password,
        passwordConfirm: data.password,
        name: data.name,
        role: 'admin',
        emailVisibility: true
      }, { $autoCancel: false });

      toast.success(`Admin "${data.name}" created successfully.`);
      setIsDialogOpen(false);
      reset();
      fetchUsers();
    } catch (error) {
      toast.error(error.data?.message || 'Failed to create admin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (user) => {
    if (!window.confirm(`Permanently delete ${user.name} (${user.email})? This cannot be undone.`)) return;
    try {
      await pb.collection('users').delete(user.id, { $autoCancel: false });
      toast.success(`User "${user.name}" deleted.`);
      fetchUsers();
    } catch (error) {
      toast.error('Failed to delete user. They may have linked records.');
    }
  };

  const getStrength = (pass) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  return (
    <>
      <Helmet>
        <title>Manage Users | Admin</title>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <section className="py-12 bg-muted min-h-[calc(100vh-80px)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-4xl font-bold text-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>
                Registered Users
              </h1>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Shield className="w-4 h-4" />
                    New Admin
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create Admin Account</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit(handleCreateAdmin)} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input {...register('name', { required: true })} placeholder="Admin name" className="text-foreground" />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input type="email" {...register('email', { required: true })} placeholder="admin@clinic.com" className="text-foreground" />
                    </div>
                    <div className="space-y-2">
                      <Label>Password</Label>
                      <Input type="text" {...register('password', { required: true, minLength: 8 })} placeholder="Set admin password" className="text-foreground font-mono" />
                      {newPassword && (
                        <div className="flex gap-1 mt-1">
                          {[1, 2, 3, 4].map((level) => (
                            <div key={level} className={`h-1 w-full rounded-full transition-colors ${
                              getStrength(newPassword) >= level ? getStrength(newPassword) < 3 ? 'bg-yellow-500' : 'bg-green-500' : 'bg-muted'
                            }`} />
                          ))}
                        </div>
                      )}
                    </div>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? 'Creating...' : 'Create Admin'}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <Card className="border-border">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Name</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Email</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Role</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Created</th>
                        <th className="text-right p-4 text-sm font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                {user.role === 'admin' ? (
                                  <Shield className="w-4 h-4 text-primary" />
                                ) : (
                                  <User className="w-4 h-4 text-muted-foreground" />
                                )}
                              </div>
                              <span className="font-medium text-foreground">{user.name}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Mail className="w-3.5 h-3.5" />
                              {user.email}
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                              user.role === 'admin'
                                ? 'bg-primary/10 text-primary'
                                : 'bg-muted text-muted-foreground'
                            }`}>
                              {user.role === 'admin' ? (
                                <span className="flex items-center gap-1">
                                  <BadgeCheck className="w-3 h-3" />
                                  Admin
                                </span>
                              ) : 'Client'}
                            </span>
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-3.5 h-3.5" />
                              {new Date(user.created).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => handleDeleteUser(user)}
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                      {users.length === 0 && (
                        <tr>
                          <td colSpan={5} className="p-12 text-center text-muted-foreground">
                            No users found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default AdminUsersPage;