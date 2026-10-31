import React, { useState, useMemo } from 'react';
import {
  Plus,
  Download,
  Receipt,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Printer,
  Eye,
  Trash2,
  Percent,
  Calculator,
  DollarSign,
  Tag,
  Building,
  User,
  Mail,
  ShieldCheck,
  CreditCard,
  ArrowRight,
} from 'lucide-react';
import { DataTable } from '../../components/common/DataTable';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { formatCurrency, formatDate } from '../../utils/formatters';

export function InvoicesPage({
  invoices = [],
  customers = [],
  products = [],
  plans = [],
  discounts = [],
  companySettings = {},
  onAddInvoice,
}) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedInvoiceForView, setSelectedInvoiceForView] = useState(null);
  const [downloadNotice, setDownloadNotice] = useState(null);

  // Available catalog items for quick dropdown insertion
  const catalogItems = useMemo(() => {
    const list = [];
    if (products?.length) {
      products.forEach((p) => {
        list.push({
          id: p.id,
          name: p.name,
          price: p.price || 0,
          type: 'Product',
        });
      });
    }
    if (plans?.length) {
      plans.forEach((pl) => {
        list.push({
          id: pl.id,
          name: `${pl.name} Plan`,
          price: pl.price || 0,
          type: 'Plan',
        });
      });
    }
    return list;
  }, [products, plans]);

  // Invoice creation form state
  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id || 'CUST-001');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 15);
    return d.toISOString().split('T')[0];
  });
  const [status, setStatus] = useState('Pending');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card / Bank Wire');
  const [invoiceNotes, setInvoiceNotes] = useState('Standard net 15 payment terms. Thank you for your business.');

  // Line items state
  const [lineItems, setLineItems] = useState([
    {
      id: 'item-1',
      description: products[0]?.name || 'Growth Professional Subscription',
      quantity: 1,
      unitPrice: products[0]?.price || 179.0,
    },
  ]);

  // Discount options
  const [discountType, setDiscountType] = useState('coupon'); // 'none' | 'coupon' | 'percent' | 'fixed'
  const [selectedCouponCode, setSelectedCouponCode] = useState(discounts[0]?.name || 'EARLYBIRD20');
  const [customDiscountPercent, setCustomDiscountPercent] = useState(10);
  const [customDiscountFixed, setCustomDiscountFixed] = useState(25);

  // Tax options
  const defaultTaxRate = useMemo(() => {
    if (companySettings?.vatRate) {
      const parsed = parseFloat(companySettings.vatRate);
      return isNaN(parsed) ? 10 : parsed;
    }
    return 10;
  }, [companySettings]);

  const [taxMode, setTaxMode] = useState('standard'); // 'standard' | 'exempt' | 'custom'
  const [customTaxRate, setCustomTaxRate] = useState(defaultTaxRate);

  const [formErrors, setFormErrors] = useState({});

  // Active customer object
  const activeCustomer = useMemo(() => {
    return customers.find((c) => c.id === selectedCustomerId) || customers[0] || {};
  }, [customers, selectedCustomerId]);

  // ----------------------------------------------------
  // Live Calculation Engine
  // ----------------------------------------------------
  const calculations = useMemo(() => {
    // 1. Calculate Subtotal from Line Items
    const subtotal = lineItems.reduce((acc, item) => {
      const qty = parseFloat(item.quantity) || 0;
      const unit = parseFloat(item.unitPrice) || 0;
      return acc + qty * unit;
    }, 0);

    // 2. Calculate Discount
    let discountAmount = 0;
    let appliedDiscountLabel = 'None';
    let discountRateApplied = 0;

    if (discountType === 'coupon') {
      const coupon = discounts.find((d) => d.name === selectedCouponCode);
      if (coupon) {
        if (coupon.type === 'Percentage') {
          const pct = parseFloat(coupon.value) || 0;
          discountRateApplied = pct;
          discountAmount = (subtotal * pct) / 100;
          appliedDiscountLabel = `${coupon.name} (${pct}% OFF)`;
        } else {
          const fixedVal = parseFloat(coupon.value?.replace(/[^0-9.]/g, '')) || 0;
          discountAmount = Math.min(subtotal, fixedVal);
          appliedDiscountLabel = `${coupon.name} ($${fixedVal.toFixed(2)} OFF)`;
        }
      }
    } else if (discountType === 'percent') {
      const pct = Math.max(0, Math.min(100, parseFloat(customDiscountPercent) || 0));
      discountRateApplied = pct;
      discountAmount = (subtotal * pct) / 100;
      appliedDiscountLabel = `Custom (${pct}% OFF)`;
    } else if (discountType === 'fixed') {
      const fixed = Math.max(0, parseFloat(customDiscountFixed) || 0);
      discountAmount = Math.min(subtotal, fixed);
      appliedDiscountLabel = `Fixed ($${fixed.toFixed(2)} OFF)`;
    }

    // 3. Calculate Taxable Base
    const taxableBase = Math.max(0, subtotal - discountAmount);

    // 4. Calculate Tax
    let effectiveTaxRate = 0;
    if (taxMode === 'standard') {
      effectiveTaxRate = defaultTaxRate;
    } else if (taxMode === 'exempt') {
      effectiveTaxRate = 0;
    } else if (taxMode === 'custom') {
      effectiveTaxRate = Math.max(0, parseFloat(customTaxRate) || 0);
    }
    const taxAmount = (taxableBase * effectiveTaxRate) / 100;

    // 5. Grand Total
    const grandTotal = taxableBase + taxAmount;

    return {
      subtotal: Math.round(subtotal * 100) / 100,
      discountAmount: Math.round(discountAmount * 100) / 100,
      discountRateApplied,
      appliedDiscountLabel,
      taxableBase: Math.round(taxableBase * 100) / 100,
      taxRate: effectiveTaxRate,
      taxAmount: Math.round(taxAmount * 100) / 100,
      grandTotal: Math.round(grandTotal * 100) / 100,
    };
  }, [
    lineItems,
    discountType,
    selectedCouponCode,
    customDiscountPercent,
    customDiscountFixed,
    discounts,
    taxMode,
    defaultTaxRate,
    customTaxRate,
  ]);

  // Line item handlers
  const handleAddLineItem = () => {
    const newItem = {
      id: `item-${Date.now()}`,
      description: 'Additional License / Service',
      quantity: 1,
      unitPrice: 50.0,
    };
    setLineItems([...lineItems, newItem]);
  };

  const handleRemoveLineItem = (index) => {
    if (lineItems.length <= 1) return;
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const handleLineItemChange = (index, field, value) => {
    const updated = [...lineItems];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setLineItems(updated);
  };

  const handleSelectCatalogItem = (index, catalogId) => {
    const found = catalogItems.find((c) => c.id === catalogId);
    if (found) {
      const updated = [...lineItems];
      updated[index] = {
        ...updated[index],
        description: found.name,
        unitPrice: found.price,
      };
      setLineItems(updated);
    }
  };

  // Due date quick shortcuts
  const handleSetDueDays = (days) => {
    const d = new Date(invoiceDate || new Date());
    d.setDate(d.getDate() + days);
    setDueDate(d.toISOString().split('T')[0]);
  };

  // Validation
  const validateInvoice = () => {
    const errs = {};
    if (!selectedCustomerId) errs.customer = 'Please select a customer';
    if (!dueDate) errs.dueDate = 'Due date is required';
    if (lineItems.length === 0) errs.items = 'At least 1 line item is required';

    let itemError = false;
    lineItems.forEach((item) => {
      if (!item.description?.trim()) itemError = true;
      if (Number(item.quantity) <= 0) itemError = true;
      if (Number(item.unitPrice) < 0) itemError = true;
    });
    if (itemError) errs.items = 'All line items must have descriptions, valid quantity, and unit price';

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Submit invoice generation
  const handleGenerateInvoice = (e) => {
    e.preventDefault();
    if (!validateInvoice()) return;

    const prefix = companySettings?.invoicePrefix || 'INV-2025-';
    const nextSeq = 1085 + invoices.length;
    const generatedInvoiceId = `${prefix}${String(nextSeq).padStart(4, '0')}`;

    const newInvoice = {
      id: generatedInvoiceId,
      customer: activeCustomer.name || 'Enterprise Client',
      customerId: activeCustomer.id || 'CUST-001',
      customerEmail: activeCustomer.email || 'billing@client.com',
      customerCompany: activeCustomer.company || 'Enterprise Partner',
      invoiceDate,
      dueDate,
      subtotal: calculations.subtotal,
      discountCode:
        discountType === 'coupon'
          ? selectedCouponCode
          : discountType === 'none'
          ? 'None'
          : `Custom (${discountType})`,
      discountType: discountType,
      discountRate: calculations.discountRateApplied,
      discountAmount: calculations.discountAmount,
      taxRate: calculations.taxRate,
      taxAmount: calculations.taxAmount,
      amount: calculations.grandTotal,
      status,
      paymentMethod,
      notes: invoiceNotes,
      items: lineItems.map((item, idx) => ({
        id: item.id || `item-${idx + 1}`,
        desc: item.description,
        qty: parseFloat(item.quantity) || 1,
        unit: parseFloat(item.unitPrice) || 0,
        total: (parseFloat(item.quantity) || 1) * (parseFloat(item.unitPrice) || 0),
      })),
    };

    onAddInvoice(newInvoice);
    setIsCreateModalOpen(false);

    // Reset line items
    setLineItems([
      {
        id: 'item-1',
        description: products[0]?.name || 'Growth Professional Subscription',
        quantity: 1,
        unitPrice: products[0]?.price || 179.0,
      },
    ]);

    // Open voucher preview of newly created invoice
    setSelectedInvoiceForView(newInvoice);
    setDownloadNotice(`Invoice ${generatedInvoiceId} successfully generated with taxes and discounts applied!`);
    setTimeout(() => setDownloadNotice(null), 4000);
  };

  // Download notice simulation
  const handleDownloadInvoice = (inv) => {
    setDownloadNotice(`Downloading Official Tax Invoice Voucher PDF: ${inv.id} (${inv.customer})...`);
    setTimeout(() => {
      setDownloadNotice(null);
    }, 3500);
  };

  // Print voucher handler
  const handlePrintVoucher = () => {
    window.print();
  };

  // Metrics summary
  const invoiceMetrics = useMemo(() => {
    const totalAmount = invoices.reduce((acc, inv) => acc + (inv.amount || 0), 0);
    const totalPaid = invoices
      .filter((inv) => inv.status === 'Paid')
      .reduce((acc, inv) => acc + (inv.amount || 0), 0);
    const totalPending = invoices
      .filter((inv) => inv.status === 'Pending')
      .reduce((acc, inv) => acc + (inv.amount || 0), 0);
    const totalTaxCollected = invoices.reduce((acc, inv) => {
      const tax = inv.taxAmount ?? (inv.amount * 0.1) / 1.1;
      return acc + (parseFloat(tax) || 0);
    }, 0);
    const totalDiscountsGranted = invoices.reduce((acc, inv) => {
      return acc + (parseFloat(inv.discountAmount) || 0);
    }, 0);

    return {
      totalAmount,
      totalPaid,
      totalPending,
      totalTaxCollected,
      totalDiscountsGranted,
    };
  }, [invoices]);

  const columns = [
    {
      header: 'Invoice #',
      accessor: 'id',
      cell: (row) => (
        <button
          onClick={() => setSelectedInvoiceForView(row)}
          className="font-semibold text-blue-600 hover:text-blue-800 font-mono flex items-center gap-1.5 transition-colors group"
          title="Inspect Official Invoice Voucher"
        >
          <Receipt className="w-3.5 h-3.5 text-blue-500 group-hover:scale-110 transition-transform" />
          <span className="underline decoration-dotted underline-offset-2">{row.id}</span>
        </button>
      ),
    },
    {
      header: 'Customer',
      accessor: 'customer',
      cell: (row) => (
        <div>
          <span className="font-semibold text-slate-800 block">{row.customer}</span>
          <span className="text-[11px] text-slate-400 block">{row.customerEmail || 'billing@domain.com'}</span>
        </div>
      ),
    },
    {
      header: 'Dates',
      accessor: 'invoiceDate',
      cell: (row) => (
        <div className="text-[11px] space-y-0.5">
          <div className="text-slate-700">Issued: {formatDate(row.invoiceDate)}</div>
          <div className="text-slate-500 font-mono">Due: {formatDate(row.dueDate)}</div>
        </div>
      ),
    },
    {
      header: 'Subtotal',
      accessor: 'subtotal',
      cell: (row) => {
        const sub = row.subtotal ?? row.amount;
        return <span className="text-slate-600 font-medium">{formatCurrency(sub)}</span>;
      },
    },
    {
      header: 'Discount',
      accessor: 'discountAmount',
      cell: (row) => {
        const disc = row.discountAmount ?? 0;
        if (disc > 0) {
          return (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              - {formatCurrency(disc)}
            </span>
          );
        }
        return <span className="text-slate-400 text-xs">—</span>;
      },
    },
    {
      header: 'Tax (VAT)',
      accessor: 'taxAmount',
      cell: (row) => {
        const tax = row.taxAmount ?? 0;
        return (
          <span className="text-slate-600 text-xs font-medium">
            {tax > 0 ? `+ ${formatCurrency(tax)}` : 'Exempt'}
          </span>
        );
      },
    },
    {
      header: 'Total Due',
      accessor: 'amount',
      cell: (row) => (
        <span className="font-bold text-slate-900 text-sm font-mono">
          {formatCurrency(row.amount)}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (row) => <Badge status={row.status} />,
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedInvoiceForView(row);
            }}
            className="h-7 px-2 text-slate-700 hover:text-blue-600 text-[11px]"
            title="Inspect Invoice Voucher"
          >
            <Eye className="w-3.5 h-3.5 mr-1 text-slate-500" /> View
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleDownloadInvoice(row);
            }}
            className="h-7 px-2 text-slate-500 hover:text-blue-600 text-[11px]"
            title="Download PDF Voucher"
          >
            <Download className="w-3.5 h-3.5 mr-1" /> PDF
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header section with KPIs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Receipt className="w-6 h-6 text-blue-600" />
            Invoices & Tax Calculation Engine
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Issue compliant invoices with live dynamic tax, coupon discounts, and itemized calculations.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => setIsCreateModalOpen(true)}
            className="shadow-sm shadow-blue-500/20"
          >
            Generate Calculated Invoice
          </Button>
        </div>
      </div>

      {/* KPI Overview Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Total Invoiced</span>
            <DollarSign className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-lg font-bold text-slate-900">
            {formatCurrency(invoiceMetrics.totalAmount)}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">{invoices.length} billing cycles issued</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Collected Revenue</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-lg font-bold text-emerald-600">
            {formatCurrency(invoiceMetrics.totalPaid)}
          </div>
          <div className="text-[10px] text-emerald-700/70 mt-0.5">Settled via wire & card</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Tax (VAT) Computed</span>
            <Calculator className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-lg font-bold text-purple-600">
            {formatCurrency(invoiceMetrics.totalTaxCollected)}
          </div>
          <div className="text-[10px] text-purple-700/70 mt-0.5">Standard {defaultTaxRate}% rate ledger</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Discounts Applied</span>
            <Tag className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-lg font-bold text-amber-600">
            {formatCurrency(invoiceMetrics.totalDiscountsGranted)}
          </div>
          <div className="text-[10px] text-amber-700/70 mt-0.5">Coupons & promo savings</div>
        </div>
      </div>

      {/* Download Alert Notification */}
      {downloadNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center justify-between animate-in fade-in">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{downloadNotice}</span>
          </span>
          <button
            onClick={() => setDownloadNotice(null)}
            className="text-emerald-700 font-bold hover:text-emerald-900 px-2"
          >
            ×
          </button>
        </div>
      )}

      {/* Invoices List DataTable */}
      <DataTable
        columns={columns}
        data={invoices}
        searchKey="customer"
        searchPlaceholder="Search invoices by customer, ID or amount..."
        filterOptions={['Paid', 'Pending', 'Overdue']}
        filterKey="status"
      />

      {/* ========================================================================= */}
      {/* GENERATE CALCULATED INVOICE MODAL                                         */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Generate Tax & Discount Calculated Invoice"
        description="Configure line items, apply coupon discounts, calculate statutory VAT/taxes, and generate an official invoice."
        maxWidth="max-w-4xl"
      >
        <form onSubmit={handleGenerateInvoice} className="space-y-5 text-xs text-slate-700">
          {/* Section 1: Customer & Invoice Timing */}
          <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-800 mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-600" />
                Select Customer *
              </label>
              <select
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium"
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} — {c.company}
                  </option>
                ))}
              </select>
              <div className="text-[11px] text-slate-500 mt-1 truncate">
                Email: {activeCustomer.email || '—'}
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-800 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                Issue Date *
              </label>
              <input
                type="date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-500" />
                  Due Date *
                </label>
                <div className="flex gap-1 text-[10px]">
                  <button
                    type="button"
                    onClick={() => handleSetDueDays(15)}
                    className="px-1.5 py-0.5 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium"
                  >
                    +15d
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetDueDays(30)}
                    className="px-1.5 py-0.5 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium"
                  >
                    +30d
                  </button>
                </div>
              </div>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  formErrors.dueDate ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-300 focus:ring-blue-500'
                } bg-white`}
              />
              {formErrors.dueDate && <p className="text-rose-500 text-[10px] mt-0.5">{formErrors.dueDate}</p>}
            </div>
          </div>

          {/* Section 2: Line Items with Subtotal Engine */}
          <div className="border border-slate-200 rounded-xl p-3.5 space-y-3 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <Receipt className="w-4 h-4 text-blue-600" />
                  Line Items & Billable Services
                </h4>
                <p className="text-[11px] text-slate-500">
                  Select from catalog products or type custom service charges.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                icon={Plus}
                onClick={handleAddLineItem}
                className="h-7 text-xs text-blue-600 border-blue-200 hover:bg-blue-50"
              >
                Add Item
              </Button>
            </div>

            {formErrors.items && (
              <p className="text-rose-500 text-[11px] bg-rose-50 p-2 rounded border border-rose-200">
                {formErrors.items}
              </p>
            )}

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {lineItems.map((item, index) => {
                const lineTotal = (parseFloat(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0);
                return (
                  <div
                    key={item.id}
                    className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center gap-2"
                  >
                    {/* Catalog Quick Selector */}
                    <div className="w-full sm:w-44">
                      <select
                        onChange={(e) => {
                          if (e.target.value) handleSelectCatalogItem(index, e.target.value);
                        }}
                        defaultValue=""
                        className="w-full px-2 py-1.5 text-[11px] border border-slate-300 rounded bg-white text-slate-700"
                        title="Quick populate from Catalog"
                      >
                        <option value="" disabled>
                          -- Autofill Catalog --
                        </option>
                        {catalogItems.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name} (${cat.price})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Description */}
                    <div className="flex-1 w-full">
                      <input
                        type="text"
                        placeholder="Item description or service..."
                        value={item.description}
                        onChange={(e) => handleLineItemChange(index, 'description', e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    {/* Quantity */}
                    <div className="w-20">
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-slate-500">Qty:</span>
                        <input
                          type="number"
                          min="1"
                          step="1"
                          value={item.quantity}
                          onChange={(e) => handleLineItemChange(index, 'quantity', e.target.value)}
                          className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded bg-white text-right focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    {/* Unit Price */}
                    <div className="w-28">
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-slate-500">$</span>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="Price"
                          value={item.unitPrice}
                          onChange={(e) => handleLineItemChange(index, 'unitPrice', e.target.value)}
                          className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded bg-white text-right focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    {/* Total */}
                    <div className="w-24 text-right font-mono font-bold text-slate-800 text-xs">
                      {formatCurrency(lineTotal)}
                    </div>

                    {/* Remove */}
                    <button
                      type="button"
                      disabled={lineItems.length <= 1}
                      onClick={() => handleRemoveLineItem(index)}
                      className={`p-1.5 rounded transition-colors ${
                        lineItems.length <= 1
                          ? 'text-slate-300 cursor-not-allowed'
                          : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                      }`}
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <span className="text-slate-500 text-xs font-medium mr-3">Items Gross Subtotal:</span>
              <span className="text-slate-900 font-bold font-mono text-sm">
                {formatCurrency(calculations.subtotal)}
              </span>
            </div>
          </div>

          {/* Section 3: Tax and Discount Calculation Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* Discount Calculator Box */}
            <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/30 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-emerald-950 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-emerald-600" />
                  1. Discount Engine
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                  Savings: - {formatCurrency(calculations.discountAmount)}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-1.5 text-[11px]">
                <button
                  type="button"
                  onClick={() => setDiscountType('none')}
                  className={`py-1 rounded font-medium border text-center transition-all ${
                    discountType === 'none'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  None
                </button>
                <button
                  type="button"
                  onClick={() => setDiscountType('coupon')}
                  className={`py-1 rounded font-medium border text-center transition-all ${
                    discountType === 'coupon'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Coupon
                </button>
                <button
                  type="button"
                  onClick={() => setDiscountType('percent')}
                  className={`py-1 rounded font-medium border text-center transition-all ${
                    discountType === 'percent'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Custom %
                </button>
                <button
                  type="button"
                  onClick={() => setDiscountType('fixed')}
                  className={`py-1 rounded font-medium border text-center transition-all ${
                    discountType === 'fixed'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Fixed $
                </button>
              </div>

              {/* Discount Dynamic Inputs */}
              {discountType === 'coupon' && (
                <div>
                  <label className="block text-[11px] font-medium text-emerald-900 mb-1">
                    Select Active Promotion Coupon:
                  </label>
                  <select
                    value={selectedCouponCode}
                    onChange={(e) => setSelectedCouponCode(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-emerald-300 rounded-lg bg-white text-xs font-semibold text-emerald-800"
                  >
                    {discounts.map((d) => (
                      <option key={d.id} value={d.name}>
                        {d.name} — {d.value} ({d.applicableProducts || 'All Services'})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {discountType === 'percent' && (
                <div>
                  <label className="block text-[11px] font-medium text-emerald-900 mb-1">
                    Enter Discount Percentage:
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={customDiscountPercent}
                      onChange={(e) => setCustomDiscountPercent(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-emerald-300 rounded-lg bg-white text-xs pr-8 font-semibold"
                    />
                    <span className="absolute right-3 top-2 text-slate-400 font-bold">%</span>
                  </div>
                </div>
              )}

              {discountType === 'fixed' && (
                <div>
                  <label className="block text-[11px] font-medium text-emerald-900 mb-1">
                    Enter Fixed Dollar Amount:
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-slate-400 font-bold">$</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={customDiscountFixed}
                      onChange={(e) => setCustomDiscountFixed(e.target.value)}
                      className="w-full pl-7 pr-2.5 py-1.5 border border-emerald-300 rounded-lg bg-white text-xs font-semibold"
                    />
                  </div>
                </div>
              )}

              <div className="text-[11px] text-emerald-800/80 bg-white/70 p-2 rounded border border-emerald-100 flex items-center justify-between">
                <span>Taxable Base after Discount:</span>
                <span className="font-mono font-bold text-slate-900">
                  {formatCurrency(calculations.taxableBase)}
                </span>
              </div>
            </div>

            {/* Tax / VAT Calculator Box */}
            <div className="p-3.5 rounded-xl border border-purple-200 bg-purple-50/30 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-purple-950 flex items-center gap-1.5">
                  <Calculator className="w-3.5 h-3.5 text-purple-600" />
                  2. Statutory Tax / VAT Engine
                </span>
                <span className="text-[10px] font-bold text-purple-700 bg-purple-100/80 px-2 py-0.5 rounded-full">
                  Tax: + {formatCurrency(calculations.taxAmount)}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                <button
                  type="button"
                  onClick={() => setTaxMode('standard')}
                  className={`py-1 rounded font-medium border text-center transition-all ${
                    taxMode === 'standard'
                      ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Standard ({defaultTaxRate}%)
                </button>
                <button
                  type="button"
                  onClick={() => setTaxMode('exempt')}
                  className={`py-1 rounded font-medium border text-center transition-all ${
                    taxMode === 'exempt'
                      ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Exempt (0%)
                </button>
                <button
                  type="button"
                  onClick={() => setTaxMode('custom')}
                  className={`py-1 rounded font-medium border text-center transition-all ${
                    taxMode === 'custom'
                      ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Custom Rate
                </button>
              </div>

              {taxMode === 'custom' && (
                <div>
                  <label className="block text-[11px] font-medium text-purple-900 mb-1">
                    Enter Tax / VAT Rate:
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      value={customTaxRate}
                      onChange={(e) => setCustomTaxRate(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-purple-300 rounded-lg bg-white text-xs pr-8 font-semibold"
                    />
                    <span className="absolute right-3 top-2 text-slate-400 font-bold">%</span>
                  </div>
                </div>
              )}

              <div className="text-[11px] text-purple-800/80 bg-white/70 p-2 rounded border border-purple-100 flex items-center justify-between">
                <span>Calculated Tax on Taxable Base ({calculations.taxRate}%):</span>
                <span className="font-mono font-bold text-slate-900">
                  + {formatCurrency(calculations.taxAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Section 4: Real-time Live Calculation Statement Card */}
          <div className="bg-slate-900 text-white rounded-xl p-4 shadow-md space-y-2.5">
            <div className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase flex items-center justify-between">
              <span>Financial Ledger Calculation Preview</span>
              <span className="text-emerald-400 text-xs font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Auto-Balanced
              </span>
            </div>

            <div className="space-y-1.5 text-xs pt-1 border-t border-slate-800">
              <div className="flex justify-between text-slate-300">
                <span>Gross Line Items Subtotal:</span>
                <span className="font-mono font-semibold">{formatCurrency(calculations.subtotal)}</span>
              </div>

              <div className="flex justify-between text-emerald-400">
                <span className="flex items-center gap-1">
                  Discount Savings ({calculations.appliedDiscountLabel}):
                </span>
                <span className="font-mono font-semibold">- {formatCurrency(calculations.discountAmount)}</span>
              </div>

              <div className="flex justify-between text-slate-400 text-[11px]">
                <span>Net Taxable Base Amount:</span>
                <span className="font-mono">{formatCurrency(calculations.taxableBase)}</span>
              </div>

              <div className="flex justify-between text-purple-300">
                <span>Statutory Tax / VAT ({calculations.taxRate}%):</span>
                <span className="font-mono font-semibold">+ {formatCurrency(calculations.taxAmount)}</span>
              </div>

              <div className="pt-2 border-t border-slate-700 flex justify-between items-center">
                <div>
                  <span className="text-sm font-bold text-white block">Official Total Payable:</span>
                  <span className="text-[10px] text-slate-400">
                    Net amount charged to customer ledger
                  </span>
                </div>
                <span className="text-xl font-extrabold font-mono text-blue-400">
                  {formatCurrency(calculations.grandTotal)}
                </span>
              </div>
            </div>
          </div>

          {/* Section 5: Status, Method & Notes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Invoice Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white"
              >
                <option value="Pending">Pending (Unpaid)</option>
                <option value="Paid">Paid (Settled)</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white"
              >
                <option value="Credit Card / Stripe">Credit Card / Stripe</option>
                <option value="Bank Wire / SWIFT">Bank Wire / SWIFT</option>
                <option value="Direct Debit (ACH)">Direct Debit (ACH)</option>
                <option value="Corporate Check">Corporate Check</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Invoice Memo / Notes</label>
              <input
                type="text"
                value={invoiceNotes}
                onChange={(e) => setInvoiceNotes(e.target.value)}
                placeholder="Optional notes or terms..."
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white"
              />
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-200">
            <Button variant="outline" type="button" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                type="submit"
                icon={Receipt}
                className="shadow-sm shadow-blue-500/20"
              >
                Generate & Record Invoice
              </Button>
            </div>
          </div>
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* OFFICIAL INVOICE VOUCHER VIEW & PRINT MODAL                               */}
      {/* ========================================================================= */}
      {selectedInvoiceForView && (
        <Modal
          isOpen={!!selectedInvoiceForView}
          onClose={() => setSelectedInvoiceForView(null)}
          title={`Official Invoice Voucher: ${selectedInvoiceForView.id}`}
          description="Legally verifiable tax invoice voucher with breakdown."
          maxWidth="max-w-3xl"
        >
          <div className="space-y-6 text-xs text-slate-700">
            {/* Voucher Sheet Container */}
            <div className="border border-slate-300 rounded-xl p-6 bg-white shadow-xs space-y-6 print:border-none print:p-0">
              {/* Header: Company & Invoice Badges */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-5 border-b border-slate-200 gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                      BL
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-slate-900 leading-tight">
                        {companySettings?.companyName || 'Brightloop Software Inc.'}
                      </h2>
                      <p className="text-[11px] text-slate-500">
                        {companySettings?.legalName || 'Brightloop Software Solutions Ltd.'}
                      </p>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2 max-w-sm">
                    {companySettings?.billingAddress || '500 Innovation Blvd, Austin, TX 78701'}
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono">
                    Tax ID / EIN: {companySettings?.taxId || 'US-EIN-987213401'}
                  </p>
                </div>

                <div className="text-right sm:self-start">
                  <div className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-1">
                    TAX INVOICE
                  </div>
                  <div className="text-lg font-bold font-mono text-slate-900">
                    {selectedInvoiceForView.id}
                  </div>
                  <div className="mt-2 flex justify-end">
                    <Badge status={selectedInvoiceForView.status} />
                  </div>
                </div>
              </div>

              {/* Bill-To and Date Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-100">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Billed To:
                  </span>
                  <div className="font-bold text-slate-900 text-sm">
                    {selectedInvoiceForView.customer}
                  </div>
                  <div className="text-slate-600">
                    {selectedInvoiceForView.customerEmail || 'billing@acme-corp.com'}
                  </div>
                  <div className="text-slate-500 text-[11px]">
                    Customer ID: {selectedInvoiceForView.customerId || 'CUST-001'}
                  </div>
                </div>

                <div className="space-y-1 sm:text-right">
                  <div className="text-slate-600">
                    <span className="text-slate-400">Issue Date: </span>
                    <span className="font-semibold">{formatDate(selectedInvoiceForView.invoiceDate)}</span>
                  </div>
                  <div className="text-slate-600">
                    <span className="text-slate-400">Payment Due: </span>
                    <span className="font-semibold text-rose-600 font-mono">
                      {formatDate(selectedInvoiceForView.dueDate)}
                    </span>
                  </div>
                  <div className="text-slate-600">
                    <span className="text-slate-400">Payment Method: </span>
                    <span className="font-medium">{selectedInvoiceForView.paymentMethod || 'Bank Wire'}</span>
                  </div>
                </div>
              </div>

              {/* Line Items Table */}
              <div>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-[11px] text-slate-400 uppercase font-semibold">
                      <th className="py-2">Item Description</th>
                      <th className="py-2 text-center w-16">Qty</th>
                      <th className="py-2 text-right w-28">Unit Price</th>
                      <th className="py-2 text-right w-28">Line Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(selectedInvoiceForView.items || []).map((item, idx) => (
                      <tr key={idx} className="text-slate-700">
                        <td className="py-2.5 font-medium">{item.desc || item.description}</td>
                        <td className="py-2.5 text-center font-mono">{item.qty || item.quantity || 1}</td>
                        <td className="py-2.5 text-right font-mono">
                          {formatCurrency(item.unit || item.unitPrice || 0)}
                        </td>
                        <td className="py-2.5 text-right font-mono font-semibold text-slate-900">
                          {formatCurrency(item.total || (item.qty || 1) * (item.unit || item.unitPrice || 0))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Calculation Summary Box */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pt-4 border-t border-slate-200">
                <div className="text-[11px] text-slate-500 max-w-sm space-y-1">
                  <span className="font-semibold text-slate-700 block">Payment Notes & Remittance:</span>
                  <p>
                    {selectedInvoiceForView.notes ||
                      'Please quote invoice number on all remittances. Standard payment terms apply.'}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    For inquiries contact: {companySettings?.supportEmail || 'billing-support@brightloop.io'}
                  </p>
                </div>

                <div className="w-full sm:w-64 space-y-1.5 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal:</span>
                    <span className="font-mono font-medium">
                      {formatCurrency(
                        selectedInvoiceForView.subtotal ?? selectedInvoiceForView.amount
                      )}
                    </span>
                  </div>

                  {/* Discount if present */}
                  {(selectedInvoiceForView.discountAmount > 0 ||
                    selectedInvoiceForView.discountCode !== 'None') && (
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span>
                        Discount {selectedInvoiceForView.discountCode ? `(${selectedInvoiceForView.discountCode})` : ''}:
                      </span>
                      <span className="font-mono">
                        - {formatCurrency(selectedInvoiceForView.discountAmount || 0)}
                      </span>
                    </div>
                  )}

                  {/* Tax */}
                  <div className="flex justify-between text-slate-600">
                    <span>Tax / VAT ({selectedInvoiceForView.taxRate ?? 10}%):</span>
                    <span className="font-mono font-medium">
                      + {formatCurrency(selectedInvoiceForView.taxAmount ?? 0)}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-300 flex justify-between font-bold text-slate-900 text-sm">
                    <span>Total Due:</span>
                    <span className="font-mono text-blue-600">
                      {formatCurrency(selectedInvoiceForView.amount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Voucher Footer Controls */}
            <div className="flex items-center justify-between pt-2">
              <Button variant="outline" onClick={() => setSelectedInvoiceForView(null)}>
                Close
              </Button>
              <div className="flex items-center gap-2">
                <Button variant="outline" icon={Printer} onClick={handlePrintVoucher}>
                  Print Voucher
                </Button>
                <Button
                  variant="primary"
                  icon={Download}
                  onClick={() => handleDownloadInvoice(selectedInvoiceForView)}
                >
                  Download PDF
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default InvoicesPage;
