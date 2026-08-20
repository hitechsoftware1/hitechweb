export type ClientDocument = {
  id: string;
  type: 'Quotation' | 'Invoice' | 'Purchase Order';
  reference?: string;
  clientName: string;
  totalAmount: number;
  currency?: string;
  notes?: string;
  status?: string;
  createdAt?: any; // Firestore Timestamp, has a .toDate() method
};

const BRAND_CYAN: [number, number, number] = [0, 163, 255];
const INK: [number, number, number] = [26, 26, 26];
const MUTED: [number, number, number] = [110, 110, 120];

function formatDate(createdAt: any) {
  try {
    const date = createdAt?.toDate ? createdAt.toDate() : new Date();
    return date.toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });
  }
}

/**
 * Builds a branded, letterhead + watermarked PDF for a Quotation, Invoice,
 * or Purchase Order and triggers a browser download. Drawn entirely with
 * jsPDF's vector primitives (no logo image loaded over the network) so it
 * renders identically every time with zero CORS/loading risk.
 *
 * jsPDF (~130KB) is dynamically imported here rather than at module scope,
 * so pages that merely import this file (e.g. the client documents list)
 * don't pay for it until someone actually clicks Download.
 */
export async function downloadClientDocumentPdf(docData: ClientDocument) {
  const { jsPDF, GState } = await import('jspdf');
  const pdf = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 48;
  const currency = docData.currency || 'UGX';

  // --- Watermark (drawn first, so it sits behind everything else) ---
  pdf.saveGraphicsState();
  pdf.setGState(new GState({ opacity: 0.06 }));
  pdf.setTextColor(...BRAND_CYAN);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(90);
  pdf.text('HITECH', pageWidth / 2, pageHeight / 2, { angle: 35, align: 'center' });
  pdf.restoreGraphicsState();

  // --- Letterhead ---
  pdf.setFillColor(10, 10, 11);
  pdf.roundedRect(margin, 40, 34, 34, 8, 8, 'F');
  pdf.setFillColor(...BRAND_CYAN);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(255, 255, 255);
  pdf.text('H', margin + 17, 63, { align: 'center' });

  pdf.setTextColor(...INK);
  pdf.setFontSize(15);
  pdf.setFont('helvetica', 'bold');
  pdf.text('HITECH', margin + 44, 58);
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(...MUTED);
  pdf.text('SOFTWARE COMPANY', margin + 44, 68);

  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...INK);
  pdf.text(docData.type.toUpperCase(), pageWidth - margin, 55, { align: 'right' });
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(...MUTED);
  pdf.text(`Ref: ${docData.reference || docData.id.slice(0, 8).toUpperCase()}`, pageWidth - margin, 68, { align: 'right' });
  pdf.text(`Date: ${formatDate(docData.createdAt)}`, pageWidth - margin, 79, { align: 'right' });

  pdf.setDrawColor(...BRAND_CYAN);
  pdf.setLineWidth(1.5);
  pdf.line(margin, 96, pageWidth - margin, 96);

  // --- Client block ---
  let y = 130;
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...MUTED);
  pdf.text('PREPARED FOR', margin, y);
  y += 16;
  pdf.setFontSize(13);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...INK);
  pdf.text(docData.clientName || 'Client', margin, y);

  if (docData.status) {
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...BRAND_CYAN);
    pdf.text(docData.status.toUpperCase(), pageWidth - margin, y, { align: 'right' });
  }

  // --- Line item table (single line — these documents track one total,
  // not itemized breakdowns) ---
  y += 40;
  pdf.setFillColor(245, 247, 250);
  pdf.rect(margin, y, pageWidth - margin * 2, 28, 'F');
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...MUTED);
  pdf.text('DESCRIPTION', margin + 12, y + 18);
  pdf.text('AMOUNT', pageWidth - margin - 12, y + 18, { align: 'right' });

  y += 28;
  const description = docData.notes?.trim() || `Professional services — ${docData.type.toLowerCase()}`;
  const descLines = pdf.splitTextToSize(description, pageWidth - margin * 2 - 160);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(...INK);
  pdf.text(descLines, margin + 12, y + 20);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`${currency} ${docData.totalAmount.toLocaleString()}`, pageWidth - margin - 12, y + 20, { align: 'right' });

  y += Math.max(30, descLines.length * 13 + 15);
  pdf.setDrawColor(230, 230, 235);
  pdf.setLineWidth(0.75);
  pdf.line(margin, y, pageWidth - margin, y);

  // --- Total ---
  y += 24;
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...MUTED);
  pdf.text('TOTAL', pageWidth - margin - 140, y);
  pdf.setFontSize(16);
  pdf.setTextColor(...BRAND_CYAN);
  pdf.text(`${currency} ${docData.totalAmount.toLocaleString()}`, pageWidth - margin, y, { align: 'right' });

  // --- Footer ---
  const footerY = pageHeight - 70;
  pdf.setDrawColor(230, 230, 235);
  pdf.line(margin, footerY, pageWidth - margin, footerY);
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(...MUTED);
  pdf.text('HITECH SOFTWARE COMPANY  ·  Naalya Kampala, Uganda  ·  hitechsoftware03@gmail.com  ·  +256 742 928 508', pageWidth / 2, footerY + 18, { align: 'center' });
  pdf.text('This document was generated electronically and is valid without a signature.', pageWidth / 2, footerY + 30, { align: 'center' });

  const filename = `HITECH-${docData.type.replace(/\s/g, '')}-${(docData.reference || docData.id.slice(0, 8)).replace(/[^\w-]/g, '')}.pdf`;
  pdf.save(filename);
}
