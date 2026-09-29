import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const CATEGORIES = [
  'Diagnostics',
  'Surgery',
  'Vaccination',
  'Emergency Care',
  'Performance Monitoring',
  'Rehabilitation'
];

const OperationForm = ({ initialData, onSubmit, onCancel, isLoading }) => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: initialData || {
      name: '',
      category: '',
      price: '',
      description: ''
    }
  });

  const category = watch('category');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Operation Name *</Label>
        <Input
          id="name"
          {...register('name', { required: 'Name is required' })}
          placeholder="e.g., General Examination"
          className="text-foreground"
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category *</Label>
        <Select value={category} onValueChange={(value) => setValue('category', value)}>
          <SelectTrigger className="text-foreground">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Price (TND) *</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          {...register('price', { 
            required: 'Price is required',
            min: { value: 0, message: 'Price must be positive' }
          })}
          placeholder="0.00"
          className="text-foreground"
        />
        {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register('description')}
          placeholder="Describe the operation"
          rows={4}
          className="text-foreground"
        />
      </div>

      <div className="flex gap-4 justify-end">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Operation'}
        </Button>
      </div>
    </form>
  );
};

export default OperationForm;