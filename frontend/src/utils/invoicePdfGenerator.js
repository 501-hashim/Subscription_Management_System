import { jsPDF } from 'jspdf';
import { formatCurrency, formatDate } from './formatters';

/**
 * Generates and triggers instant client-side download of an official Tax Invoice PDF.
 * @param {Object} invoice The invoice object with items, subtotal, discount, tax, amount.
 * @param {Object} companySettings Company billing details and tax ID.
 */
export function downloadInvoicePDF(invoice, companySettings = {}) {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 16;
    let y = 16;

    // ----------------------------------------------------
    // 1. TOP HEADER BANNER
    // ----------------------------------------------------
    // Brand banner rectangle
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(margin, y, pageWidth - margin * 2, 28, 'F');

    // Accent line
    doc.setFillColor(37, 99, 235); // blue-600
    doc.rect(margin, y + 27, pageWidth - margin * 2, 1.5, 'F');

    // Company logo / brand icon
    doc.setFillColor(37, 99, 235);
    doc.roundedRect(margin + 6, y + 5, 10, 10, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('BL', margin + 8.5, y + 11.5);

    // Company Name
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text(companySettings.companyName || 'Brightloop Software Inc.', margin + 20, y + 10);

    // Legal entity & tax
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text(
      `${companySettings.legalName || 'Brightloop Software Solutions Ltd.'}  •  Tax ID: ${
        companySettings.taxId || 'US-EIN-987213401'
      }`,
      margin + 20,
      y + 15
    );
    doc.text(
      companySettings.billingAddress || '500 Innovation Blvd, Tech Park, Suite 300, Austin, TX 78701',
      margin + 20,
      y + 20
    );

    // Right-side Title in banner
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('TAX INVOICE', pageWidth - margin - 6, y + 11, { align: 'right' });

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(147, 197, 253); // blue-300
    doc.text(invoice.id || 'INV-2025-0000', pageWidth - margin - 6, y + 17, { align: 'right' });

    // Status pill
    const statusText = (invoice.status || 'Pending').toUpperCase();
    if (statusText === 'PAID') {
      doc.setTextColor(52, 211, 153); // emerald-400
    } else if (statusText === 'OVERDUE') {
      doc.setTextColor(248, 113, 113); // red-400
    } else {
      doc.setTextColor(251, 191, 36); // amber-400
    }
    doc.setFontSize(8);
    doc.text(`STATUS: ${statusText}`, pageWidth - margin - 6, y + 22, { align: 'right' });

    y += 36;

    // ----------------------------------------------------
    // 2. BILL TO & INVOICE DETAILS GRID
    // ----------------------------------------------------
    const colWidth = (pageWidth - margin * 2) / 2;

    // Bill To Box (Left)
    doc.setFillColor(248, 250, 252); // slate-50
    doc.roundedRect(margin, y, colWidth - 4, 32, 2, 2, 'F');
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.roundedRect(margin, y, colWidth - 4, 32, 2, 2, 'S');

    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text('BILLED TO:', margin + 5, y + 6);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42); // slate-900
    doc.text(invoice.customer || 'Enterprise Customer', margin + 5, y + 13);

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(invoice.customerCompany || invoice.customer || '', margin + 5, y + 18);
    doc.text(`Email: ${invoice.customerEmail || 'billing@customer.com'}`, margin + 5, y + 23);
    doc.text(`Account ID: ${invoice.customerId || 'CUST-001'}`, margin + 5, y + 28);

    // Invoice Meta Box (Right)
    const rightColX = margin + colWidth + 4;
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(rightColX, y, colWidth - 4, 32, 2, 2, 'F');
    doc.roundedRect(rightColX, y, colWidth - 4, 32, 2, 2, 'S');

    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(100, 116, 139);
    doc.text('INVOICE SPECIFICATIONS:', rightColX + 5, y + 6);

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    doc.text('Invoice Date:', rightColX + 5, y + 13);
    doc.setFont('helvetica', 'bold');
    doc.text(formatDate(invoice.invoiceDate), rightColX + colWidth - 9, y + 13, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.text('Payment Due Date:', rightColX + 5, y + 19);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(220, 38, 38); // red-600
    doc.text(formatDate(invoice.dueDate), rightColX + colWidth - 9, y + 19, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    doc.text('Payment Method:', rightColX + 5, y + 25);
    doc.setFont('helvetica', 'bold');
    doc.text(invoice.paymentMethod || 'Bank Wire / Card', rightColX + colWidth - 9, y + 25, {
      align: 'right',
    });

    y += 38;

    // ----------------------------------------------------
    // 3. LINE ITEMS TABLE
    // ----------------------------------------------------
    const tableWidth = pageWidth - margin * 2;
    const descWidth = tableWidth - 16 - 28 - 32;

    // Table Header
    doc.setFillColor(241, 245, 249); // slate-100
    doc.rect(margin, y, tableWidth, 8, 'F');
    doc.setDrawColor(203, 213, 225); // slate-300
    doc.rect(margin, y, tableWidth, 8, 'S');

    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text('ITEM DESCRIPTION', margin + 4, y + 5.5);
    doc.text('QTY', margin + descWidth + 8, y + 5.5, { align: 'center' });
    doc.text('UNIT PRICE', margin + descWidth + 16 + 14, y + 5.5, { align: 'right' });
    doc.text('LINE TOTAL', margin + tableWidth - 4, y + 5.5, { align: 'right' });

    y += 8;

    // Table Rows
    const items = invoice.items && invoice.items.length > 0
      ? invoice.items
      : [{ desc: 'Subscription Service Cycle', qty: 1, unit: invoice.amount, total: invoice.amount }];

    doc.setFont('helvetica', 'normal');
    items.forEach((item, index) => {
      const isEven = index % 2 === 0;
      if (isEven) {
        doc.setFillColor(255, 255, 255);
      } else {
        doc.setFillColor(248, 250, 252);
      }
      doc.rect(margin, y, tableWidth, 9, 'F');
      doc.setDrawColor(241, 245, 249);
      doc.line(margin, y + 9, margin + tableWidth, y + 9);

      const itemDesc = item.desc || item.description || 'Subscription Line Item';
      const itemQty = String(item.qty || item.quantity || 1);
      const itemUnit = formatCurrency(item.unit || item.unitPrice || 0);
      const itemTotal = formatCurrency(
        item.total || (parseFloat(itemQty) || 1) * (parseFloat(item.unit || item.unitPrice || 0))
      );

      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42);
      doc.text(itemDesc, margin + 4, y + 6);
      doc.text(itemQty, margin + descWidth + 8, y + 6, { align: 'center' });
      doc.text(itemUnit, margin + descWidth + 16 + 14, y + 6, { align: 'right' });
      doc.setFont('helvetica', 'bold');
      doc.text(itemTotal, margin + tableWidth - 4, y + 6, { align: 'right' });
      doc.setFont('helvetica', 'normal');

      y += 9;
    });

    y += 6;

    // ----------------------------------------------------
    // 4. FINANCIAL SUMMARY BREAKDOWN & REMITTANCE
    // ----------------------------------------------------
    const summaryWidth = 78;
    const summaryX = pageWidth - margin - summaryWidth;

    // Left notes section
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text('PAYMENT TERMS & REMITTANCE:', margin, y + 4);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(
      invoice.notes ||
        'Standard payment terms apply. Please remit wire or card payment before the due date.',
      margin,
      y + 9,
      { maxWidth: summaryX - margin - 6 }
    );
    doc.text(
      `Support: ${companySettings.supportEmail || 'billing-support@brightloop.io'}`,
      margin,
      y + 15
    );
    doc.text(
      'All accounts are governed by Brightloop Master Subscription Agreement.',
      margin,
      y + 20
    );

    // Right Summary Box
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(summaryX, y, summaryWidth, 42, 2, 2, 'F');
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(summaryX, y, summaryWidth, 42, 2, 2, 'S');

    let sumY = y + 6;
    doc.setFontSize(8.5);

    // Subtotal
    const subtotalVal = invoice.subtotal ?? invoice.amount ?? 0;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text('Gross Subtotal:', summaryX + 4, sumY);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(formatCurrency(subtotalVal), summaryX + summaryWidth - 4, sumY, { align: 'right' });

    sumY += 6;

    // Discount
    const discountVal = parseFloat(invoice.discountAmount) || 0;
    if (discountVal > 0 || (invoice.discountCode && invoice.discountCode !== 'None')) {
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(5, 150, 105); // emerald-600
      const discLabel = invoice.discountCode && invoice.discountCode !== 'None'
        ? `Discount (${invoice.discountCode}):`
        : 'Discount Applied:';
      doc.text(discLabel, summaryX + 4, sumY);
      doc.setFont('helvetica', 'bold');
      doc.text(`- ${formatCurrency(discountVal)}`, summaryX + summaryWidth - 4, sumY, {
        align: 'right',
      });
      sumY += 6;
    }

    // Taxable Base
    const taxableBase = Math.max(0, subtotalVal - discountVal);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text('Taxable Base:', summaryX + 4, sumY);
    doc.text(formatCurrency(taxableBase), summaryX + summaryWidth - 4, sumY, { align: 'right' });

    sumY += 6;

    // Tax
    const taxRate = invoice.taxRate ?? 10;
    const taxVal = parseFloat(invoice.taxAmount) || 0;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(`Statutory VAT (${taxRate}%):`, summaryX + 4, sumY);
    doc.setFont('helvetica', 'bold');
    doc.text(`+ ${formatCurrency(taxVal)}`, summaryX + summaryWidth - 4, sumY, { align: 'right' });

    sumY += 7;

    // Grand Total Highlight
    doc.setFillColor(37, 99, 235); // blue-600
    doc.rect(summaryX, sumY - 4.5, summaryWidth, 10, 'F');

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('TOTAL DUE:', summaryX + 4, sumY + 2);
    doc.text(formatCurrency(invoice.amount), summaryX + summaryWidth - 4, sumY + 2, {
      align: 'right',
    });

    // ----------------------------------------------------
    // 5. FOOTER
    // ----------------------------------------------------
    const footerY = pageHeight - 12;
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, footerY - 4, pageWidth - margin, footerY - 4);

    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184);
    doc.text(
      'Brightloop Subscription Management Platform  •  Computer-generated official invoice document.',
      margin,
      footerY
    );
    doc.text(`Page 1 of 1`, pageWidth - margin, footerY, { align: 'right' });

    // ----------------------------------------------------
    // 6. TRIGGER INSTANT BROWSER DOWNLOAD
    // ----------------------------------------------------
    const filename = `${invoice.id || 'INVOICE'}.pdf`;
    doc.save(filename);
    return true;
  } catch (error) {
    console.error('PDF generation error:', error);
    // Fallback: trigger print dialog if PDF fails
    window.print();
    return false;
  }
}
