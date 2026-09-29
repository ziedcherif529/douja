import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const HorseForm = ({ initialData, onSubmit, onCancel, isLoading }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialData || {
      name: '',
      breed: '',
      age: '',
      color: '',
      microchip: '',
      notes: ''
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Horse Name *</Label>
        <Input
          id="name"
          {...register('name', { required: 'Name is required' })}
          placeholder="Enter horse name"
          className="text-foreground"
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="breed">Breed</Label>
          <Input
            id="breed"
            {...register('breed')}
            placeholder="e.g., Arabian, Thoroughbred"
            className="text-foreground"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            type="number"
            {...register('age')}
            placeholder="Age in years"
            className="text-foreground"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="color">Color</Label>
          <Input
            id="color"
            {...register('color')}
            placeholder="e.g., Bay, Chestnut"
            className="text-foreground"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="microchip">Microchip Number</Label>
          <Input
            id="microchip"
            {...register('microchip')}
            placeholder="Microchip ID"
            className="text-foreground"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          {...register('notes')}
          placeholder="Additional information about the horse"
          rows={4}
          className="text-foreground"
        />
      </div>

      <div className="flex gap-4 justify-end">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Horse'}
        </Button>
      </div>
    </form>
  );
};

export default HorseForm;