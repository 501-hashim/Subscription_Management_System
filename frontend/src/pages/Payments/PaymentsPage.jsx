import React from 'react';
import { CreditCard, ArrowDownLeft, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { DataTable } from '../../components/common/DataTable';
import { Badge } from '../../components/common/Badge';
import { formatCurrency } from '../../utils/formatters';
import { Card, CardContent } from '../../components/common/Card';

export function PaymentsPage({ payments }) {
  const totalProcessed = payments
    .filter((p) => p.status === 'Completed')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const columns = [
    {
      header: 'Payment ID',
      accessor: 'id',
      cell: (row) => (
        <span className="font-semibold text-blue-600 font-mono flex items-center gap-1.5">
          <CreditCard className="w-3.5 h-3.5 text-blue-500" /> {row.id}
        </span>
      ),
    },
    {
      header: 'Customer',
      accessor: 'customer',
      cell: (row) => <span className="font-medium text-slate-800">{row.customer}</span>,
    },
    {
      header: 'Invoice Ref',
      accessor: 'invoiceNumber',
      cell: (row) => <span className="font-mono text-slate-600 text-[11px]">{row.invoiceNumber}</span>,
    },
    {
      header: 'Payment Method',
      accessor: 'paymentMethod',
      cell: (row) => (
        <span className="text-slate-700 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-slate-300" /> {row.paymentMethod}
        </span>
      ),
    },
    {
      header: 'Amount',
      accessor: 'amount',
      cell: (row) => <span className="font-bold text-slate-900">{formatCurrency(row.amount)}</span>,
    },
    {
      header: 'Payment Date',
      accessor: 'paymentDate',
      cell: (row) => <span className="text-slate-500 text-[11px]">{row.paymentDate}</span>,
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (row) => <Badge status={row.status} />,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-slate-900">Payments & Settlements</h1>
          <p className="text-xs text-slate-500">Gateway transactions, automated direct debits, and credit card settlements.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs">
            <span className="text-emerald-700 font-medium">Successfully Settled: </span>
            <span className="font-bold text-emerald-900">{formatCurrency(totalProcessed)}</span>
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={payments}
        searchKey="customer"
        searchPlaceholder="Search payments by customer or ID..."
        filterOptions={['Completed', 'Processing', 'Failed']}
        filterKey="status"
      />
    </div>
  );
}
