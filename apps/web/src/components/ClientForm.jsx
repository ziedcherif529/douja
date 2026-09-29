import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const ClientForm = ({ initialData, onSubmit, onCancel, isLoading }) => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: initialData || {
      name: '',
      email: '',
      password: '',
      phone: '',
      address: '',
      city: '',
      country: '',
      notes: ''
    }
  });

  const password = watch('password', '');

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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name *</Label>
        <Input
          id="name"
          {...register('name', { required: 'Name is required' })}
          placeholder="Enter client name"
          className="text-foreground"
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            {...register('email', { 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
            placeholder="client@example.com"
            className="text-foreground"
          />
          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            {...register('phone')}
            placeholder="+216 XX XXX XXX"
            className="text-foreground"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Temporary Password *</Label>
        <Input
          id="password"
          type="text"
          {...register('password', { 
            required: 'Password is required',
            minLength: { value: 8, message: 'Must be at least 8 characters' }
          })}
          placeholder="Set initial password for the client"
          className="text-foreground font-mono"
        />
        {password && (
          <div className="flex gap-1 mt-1">
            {[1, 2, 3, 4].map((level) => (
              <div key={level} className={`h-1 w-full rounded-full transition-colors ${
                getStrength(password) >= level ? getStrength(password) < 3 ? 'bg-yellow-500' : 'bg-green-500' : 'bg-muted'
              }`} />
            ))}
          </div>
        )}
        {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          {...register('address')}
          placeholder="Street address"
          className="text-foreground"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            {...register('city')}
            placeholder="City"
            className="text-foreground"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            {...register('country')}
            placeholder="Country"
            className="text-foreground"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          {...register('notes')}
          placeholder="Additional information"
          rows={3}
          className="text-foreground"
        />
      </div>

      <div className="flex gap-4 justify-end">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Client'}
        </Button>
      </div>
    </form>
  );
};

export default ClientForm;