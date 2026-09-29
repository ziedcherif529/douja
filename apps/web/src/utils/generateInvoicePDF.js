import { jsPDF } from 'jspdf';
import { formatCurrency } from '@/utils/formatCurrency.js';

const MONTHS_FR = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];

function formatFrenchDate(date) {
  const d = date instanceof Date ? date : new Date(date);
  return `${d.getDate()} ${MONTHS_FR[d.getMonth()]} ${d.getFullYear()}`;
}

export function generateInvoicePDF({ invoice, client, horse, items, operations }) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;

  const drawHeader = (startY) => {
    doc.setFillColor(45, 80, 22);
    doc.rect(margin, startY, contentWidth, 52, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('CLINIQUE VÉTÉRINAIRE BAVET', margin + 5, startY + 10);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Médecine et Chirurgie Équines', margin + 5, startY + 20);

    doc.setFontSize(8);
    doc.text('3021 Sfax | N.I.O : 2248', margin + 5, startY + 28);
    doc.text('Tél : 58 050 691', margin + 5, startY + 35);
    doc.text('Email : ahmed.bah95@gmail.com', margin + 5, startY + 42);

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('FACTURE', pageWidth - margin - 5, startY + 10, { align: 'right' });

    const now = new Date();
    const dateStr = formatFrenchDate(now);
    doc.setFontSize(8);
    doc.text(`Générée le : ${dateStr}`, pageWidth - margin - 5, startY + 22, { align: 'right' });
    doc.text("Lieu d'émission : Sfax, Tunisie", pageWidth - margin - 5, startY + 30, { align: 'right' });
  };

  const drawInvoiceMeta = (startY) => {
    let y = startY;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);

    const leftCol = [
      `N° de facture : ${invoice.invoice_number}`,
      `Date d'émission : ${formatFrenchDate(invoice.invoice_date)}`,
    ];
    if (invoice.due_date) {
      leftCol.push(`Date d'échéance : ${formatFrenchDate(invoice.due_date)}`);
    }

    leftCol.forEach((line) => {
      doc.text(line, margin, y);
      y += 6;
    });

    return y + 4;
  };

  const drawClientInfo = (startY) => {
    const boxHeight = horse ? 42 : 35;
    doc.setDrawColor(220, 220, 220);
    doc.setFillColor(249, 250, 251);
    doc.roundedRect(margin, startY, contentWidth, boxHeight, 3, 3, 'FD');

    doc.setTextColor(45, 80, 22);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('FACTURÉ À', margin + 8, startY + 10);

    doc.setTextColor(60, 60, 60);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    let y = startY + 20;
    doc.text(client?.name || '', margin + 8, y);
    y += 7;
    if (client?.phone) {
      doc.text(`Tél : ${client.phone}`, margin + 8, y);
      y += 7;
    }
    doc.text(client?.email || '', margin + 8, y);

    if (horse) {
      doc.setTextColor(45, 80, 22);
      doc.setFont('helvetica', 'bold');
      doc.text('Cheval :', pageWidth - margin - 8, startY + 10, { align: 'right' });
      doc.setTextColor(60, 60, 60);
      doc.setFont('helvetica', 'normal');
      doc.text(horse.name, pageWidth - margin - 8, startY + 20, { align: 'right' });
      doc.text(horse.breed || '', pageWidth - margin - 8, startY + 28, { align: 'right' });
    }

    return startY + boxHeight + 5;
  };

  const drawItemsTable = (startY) => {
    const tableWidth = contentWidth;
    const colWidths = [tableWidth * 0.4, tableWidth * 0.12, tableWidth * 0.24, tableWidth * 0.24];
    const colX = [margin];
    for (let i = 0; i < colWidths.length - 1; i++) {
      colX.push(colX[i] + colWidths[i]);
    }

    doc.setFillColor(45, 80, 22);
    doc.rect(margin, startY, tableWidth, 8, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('Prestation', colX[0] + 3, startY + 5.5);
    doc.text('Qté', colX[1] + 3, startY + 5.5);
    doc.text('Prix unitaire', colX[2] + 3, startY + 5.5);
    doc.text('Total', colX[3] + 3, startY + 5.5);

    let y = startY + 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);

    items.forEach((item, index) => {
      const operation = operations.find(op => op.id === item.operationId);
      const name = operation?.name || 'Prestation';
      const longName = doc.splitTextToSize(name, colWidths[0] - 6);

      const rowHeight = Math.max(8, longName.length * 5 + 4);

      if (index % 2 === 0) {
        doc.setFillColor(249, 250, 251);
        doc.rect(margin, y, tableWidth, rowHeight, 'F');
      }

      doc.setTextColor(60, 60, 60);
      doc.text(longName, colX[0] + 3, y + 4);
      doc.text(item.quantity.toString(), colX[1] + 3, y + 4);
      doc.text(formatCurrency(item.unit_price), colX[2] + 3, y + 4);
      doc.setFont('helvetica', 'bold');
      doc.text(formatCurrency(item.line_total), colX[3] + 3, y + 4);
      doc.setFont('helvetica', 'normal');

      doc.setDrawColor(230, 230, 230);
      doc.line(margin, y + rowHeight, margin + tableWidth, y + rowHeight);

      y += rowHeight;
    });

    doc.setFillColor(45, 80, 22);
    doc.rect(margin, y, tableWidth, 12, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL', colX[2] + 3, y + 8);
    doc.text(formatCurrency(invoice.total_amount), colX[3] + 3, y + 8);

    return y + 18;
  };

  const drawNotes = (startY) => {
    if (!invoice.notes) return startY;

    doc.setDrawColor(220, 220, 220);
    doc.line(margin, startY, margin + contentWidth, startY);

    doc.setTextColor(45, 80, 22);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Notes :', margin, startY + 10);

    doc.setTextColor(100, 100, 100);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const splitNotes = doc.splitTextToSize(invoice.notes, contentWidth - 10);
    doc.text(splitNotes, margin, startY + 20);

    return startY + 20 + splitNotes.length * 5 + 10;
  };

  const drawSignature = (startY) => {
    doc.setDrawColor(220, 220, 220);
    doc.line(margin, startY, margin + contentWidth, startY);

    doc.setTextColor(45, 80, 22);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('CLINIQUE VÉTÉRINAIRE BAVET', margin, startY + 10);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Médecine et Chirurgie Équines', margin, startY + 18);
    doc.text('3021 Sfax | N.I.O : 2248', margin, startY + 25);
    doc.text('Tél : 58 050 691', margin, startY + 32);

    const boxX = pageWidth - margin - 65;
    const boxY = startY + 6;
    doc.setDrawColor(180, 180, 180);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(boxX, boxY, 65, 35, 2, 2, 'S');

    doc.setTextColor(150, 150, 150);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text('Signature du', boxX + 32, boxY + 14, { align: 'center' });
    doc.text('vétérinaire', boxX + 32, boxY + 22, { align: 'center' });

    return startY + 48;
  };

  const drawFooter = () => {
    const footerY = doc.internal.pageSize.getHeight() - 20;

    doc.setTextColor(150, 150, 150);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');

    const now = new Date();
    const dateStr = formatFrenchDate(now);
    doc.text(`Facture générée automatiquement le ${dateStr}.`, pageWidth / 2, footerY, { align: 'center' });

    doc.setDrawColor(200, 200, 200);
    doc.line(margin, footerY + 4, margin + contentWidth, footerY + 4);

    doc.text('CLINIQUE VÉTÉRINAIRE BAVET \u2013 3021 Sfax \u2013 Tél : 58 050 691', pageWidth / 2, footerY + 12, { align: 'center' });
  };

  let y = margin;
  drawHeader(y);
  y += 60;
  y = drawInvoiceMeta(y);
  y = drawClientInfo(y);
  y += 5;
  y = drawItemsTable(y);
  y = drawNotes(y);
  y = drawSignature(y);
  drawFooter();

  doc.save(`facture-${invoice.invoice_number}.pdf`);
}
