import React from 'react';
import { formatCurrency } from '@/utils/formatCurrency.js';
import { formatDate } from '@/utils/formatDate.js';
import { Separator } from '@/components/ui/separator';

const InvoicePreview = ({ invoice, client, horse, items, operations }) => {
  return (
    <div className="bg-card p-8 rounded-xl border border-border">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary" style={{ fontFamily: 'Playfair Display, serif' }}>
          BAVET
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Clinique Vétérinaire</p>
        <p className="text-sm text-muted-foreground">Tunis, Tunisie</p>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="font-semibold text-foreground mb-2">Facturé à :</h3>
          <p className="text-foreground">{client?.name}</p>
          <p className="text-sm text-muted-foreground">{client?.email}</p>
          {client?.phone && <p className="text-sm text-muted-foreground">{client.phone}</p>}
          {client?.address && <p className="text-sm text-muted-foreground">{client.address}</p>}
        </div>

        <div className="text-right">
          <h3 className="font-semibold text-foreground mb-2">Détails de la facture :</h3>
          <p className="text-sm text-muted-foreground">Facture n° : {invoice?.invoice_number}</p>
          <p className="text-sm text-muted-foreground">Date : {formatDate(invoice?.invoice_date)}</p>
          {invoice?.due_date && (
            <p className="text-sm text-muted-foreground">Échéance : {formatDate(invoice.due_date)}</p>
          )}
          {horse && <p className="text-sm text-muted-foreground mt-2">Cheval : {horse.name}</p>}
        </div>
      </div>

      <Separator className="my-6" />

      <table className="w-full mb-8">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 text-foreground font-semibold">Prestation</th>
            <th className="text-center py-3 text-foreground font-semibold">Qté</th>
            <th className="text-right py-3 text-foreground font-semibold">Prix unitaire</th>
            <th className="text-right py-3 text-foreground font-semibold">Total</th>
          </tr>
        </thead>
        <tbody>
          {items?.map((item, index) => {
            const operation = operations?.find(op => op.id === item.operationId);
            return (
              <tr key={index} className="border-b border-border">
                <td className="py-3 text-foreground">{operation?.name || 'Prestation'}</td>
                <td className="text-center py-3 text-foreground">{item.quantity}</td>
                <td className="text-right py-3 text-foreground">{formatCurrency(item.unit_price)}</td>
                <td className="text-right py-3 text-foreground">{formatCurrency(item.line_total)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="flex justify-end">
        <div className="w-64 space-y-2">
          <div className="flex justify-between text-lg font-bold text-foreground">
            <span>Total :</span>
            <span>{formatCurrency(invoice?.total_amount)}</span>
          </div>
        </div>
      </div>

      {invoice?.notes && (
        <div className="mt-8 pt-6 border-t border-border">
          <h4 className="font-semibold text-foreground mb-2">Notes :</h4>
          <p className="text-sm text-muted-foreground">{invoice.notes}</p>
        </div>
      )}
    </div>
  );
};

export default InvoicePreview;
