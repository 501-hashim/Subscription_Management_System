import React, { useState } from 'react';
import { Eye, Repeat, Calendar, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { DataTable } from '../../components/common/DataTable';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { formatCurrency, formatDate } from '../../utils/formatters';

export function SubscriptionsPage({ subscriptions }) {
  const [selectedSub, setSelectedSub] = useState(null);

  const columns = [
    {
      header: 'Subscription ID',
      accessor: 'id',
      cell: (row) => (
        <span className="font-semibold text-blue-600 font-mono flex items-center gap-1.5">
          <Repeat className="w-3.5 h-3.5 text-blue-500" /> {row.id}
        </span>
      ),
    },
    {
      header: 'Customer',
      accessor: 'customer',
      cell: (row) => <span className="font-medium text-slate-800">{row.customer}</span>,
    },
    {
      header: 'Plan / Tier',
      accessor: 'plan',
      cell: (row) => <span className="text-slate-700 font-medium">{row.plan}</span>,
    },
    {
      header: 'Start Date',
      accessor: 'startDate',
      cell: (row) => <span className="text-slate-500 text-[11px]">{formatDate(row.startDate)}</span>,
    },
    {
      header: 'Expiry Date',
      accessor: 'expiryDate',
      cell: (row) => <span className="text-slate-500 text-[11px]">{formatDate(row.expiryDate)}</span>,
    },
    {
      header: 'Billing Cycle',
      accessor: 'billingCycle',
      cell: (row) => (
        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-medium">
          {row.billingCycle}
        </span>
      ),
    },
    {
      header: 'Recurring Amount',
      accessor: 'amount',
      cell: (row) => <span className="font-bold text-slate-900">{formatCurrency(row.amount)}</span>,
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
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedSub(row);
            }}
            className="h-8 px-2 text-blue-600 hover:text-blue-700"
          >
            <Eye className="w-3.5 h-3.5 mr-1" /> View Details
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-slate-900">Active Subscriptions</h1>
          <p className="text-xs text-slate-500">Monitor automated recurring renewals, active contracts, and status lifecycles.</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={subscriptions}
        searchKey="customer"
        searchPlaceholder="Search subscriptions by customer or ID..."
        filterOptions={['Active', 'Pending Renewal', 'Suspended']}
        filterKey="status"
        onRowClick={(row) => setSelectedSub(row)}
      />

      {/* Subscription Detail Modal */}
      <Modal
        isOpen={!!selectedSub}
        onClose={() => setSelectedSub(null)}
        title={`Subscription Details: ${selectedSub?.id}`}
        description="Comprehensive recurring service lifecycle parameters."
      >
        {selectedSub && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Customer</span>
                <span className="font-semibold text-slate-800 text-sm">{selectedSub.customer}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Current Status</span>
                <Badge status={selectedSub.status} />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Enrolled Plan</span>
                <span className="font-medium text-slate-800">{selectedSub.plan}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Cycle Amount</span>
                <span className="font-bold text-slate-900">{formatCurrency(selectedSub.amount)} / {selectedSub.billingCycle}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Contract Start</span>
                <span className="text-slate-700">{formatDate(selectedSub.startDate)}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Contract Expiry</span>
                <span className="text-slate-700">{formatDate(selectedSub.expiryDate)}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Next Invoice Date</span>
                <span className="text-blue-600 font-medium">{formatDate(selectedSub.nextBillingDate)}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Auto Renewal</span>
                <span className={`font-semibold ${selectedSub.autoRenew ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {selectedSub.autoRenew ? 'Enabled (Automatic)' : 'Manual Review'}
                </span>
              </div>
            </div>

            <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-lg flex items-start gap-2.5">
              <RefreshCw className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
              <p className="text-[11px] text-blue-900">
                Invoices for this contract are automatically drafted 7 days prior to next billing date. 
                Payment attempts will use the primary card on file.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button variant="outline" size="sm" onClick={() => setSelectedSub(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
