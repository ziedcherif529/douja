import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { generateInvoicePDF } from '@/utils/generateInvoicePDF.js';

const PDFExport = ({ invoice, client, horse, items, operations }) => {
  return (
    <Button onClick={() => generateInvoicePDF({ invoice, client, horse, items, operations })} variant="outline" className="gap-2">
      <Download className="w-4 h-4" />
      Télécharger PDF
    </Button>
  );
};

export default PDFExport;
