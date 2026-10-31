import React, { useState } from 'react';
import { 
  Plus, 
  Package, 
  LayoutGrid, 
  List, 
  Play, 
  Check, 
  Info, 
  ThumbsUp, 
  Sparkles, 
  Star,
  Film,
  Zap,
  Tag,
  ChevronRight,
  X,
  CheckCircle2,
} from 'lucide-react';
import { DataTable } from '../../components/common/DataTable';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { formatCurrency } from '../../utils/formatters';

export function ProductsPage({ products = [], onAddProduct }) {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' (Netflix boxes) | 'table'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [subscribedIds, setSubscribedIds] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    type: 'Service / SaaS',
    salesPrice: '',
    costPrice: '',
    variants: '',
    status: 'Available',
    description: '',
    image: '',
    badge: 'New Release',
    rating: '98% Match',
  });
  const [errors, setErrors] = useState({});

  const toggleSubscribe = (id, e) => {
    if (e) e.stopPropagation();
    setSubscribedIds((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Product name is required';
    if (!formData.salesPrice || Number(formData.salesPrice) <= 0) {
      errs.salesPrice = 'Valid sales price is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const newProd = {
      id: `PROD-${String(products.length + 1).padStart(3, '0')}`,
      name: formData.name,
      code: formData.code || `BL-${formData.name.slice(0, 4).toUpperCase()}`,
      type: formData.type,
      salesPrice: parseFloat(formData.salesPrice),
      costPrice: formData.costPrice ? parseFloat(formData.costPrice) : 0,
      variants: formData.variants ? formData.variants.split(',').map((v) => v.trim()) : ['Standard'],
      status: formData.status,
      description: formData.description || 'Enterprise grade scalable subscription service module.',
      image: formData.image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80',
      rating: formData.rating || '97% Match',
      badge: formData.badge || 'New',
      category: formData.type,
      duration: 'Auto-Renew / mo',
    };

    onAddProduct(newProd);
    setIsAddModalOpen(false);
    setFormData({
      name: '',
      code: '',
      type: 'Service / SaaS',
      salesPrice: '',
      costPrice: '',
      variants: '',
      status: 'Available',
      description: '',
      image: '',
      badge: 'New Release',
      rating: '98% Match',
    });
    setErrors({});
  };

  const columns = [
    {
      header: 'Product',
      accessor: 'name',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-slate-900 border border-slate-200">
            <img 
              src={row.image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=300&q=80'} 
              alt={row.name}
              className="w-full h-full object-cover" 
            />
          </div>
          <div>
            <span className="font-semibold text-slate-900 block">{row.name}</span>
            <span className="text-[11px] font-mono text-slate-400">{row.code}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Type',
      accessor: 'type',
      cell: (row) => (
        <span className="text-slate-600 bg-slate-100 px-2 py-0.5 rounded text-[11px] font-medium">
          {row.type}
        </span>
      ),
    },
    {
      header: 'Price',
      accessor: 'salesPrice',
      cell: (row) => <span className="font-bold text-slate-900">{formatCurrency(row.salesPrice)}</span>,
    },
    {
      header: 'Cost Price',
      accessor: 'costPrice',
      cell: (row) => <span className="text-slate-500">{formatCurrency(row.costPrice)}</span>,
    },
    {
      header: 'Variants',
      accessor: 'variants',
      cell: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.variants?.map((v, i) => (
            <span
              key={i}
              className="inline-block px-1.5 py-0.5 bg-blue-50 text-blue-700 text-[10px] rounded border border-blue-200"
            >
              {v}
            </span>
          ))}
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (row) => <Badge status={row.status} />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header and View Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Product Catalog</h1>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-red-600 text-white shadow-xs">
              Netflix View
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Cinematic box view showcasing software modules, billing frequencies, and pricing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="bg-slate-100 p-1 rounded-lg flex items-center gap-1 border border-slate-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                viewMode === 'grid'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Netflix Boxes</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Table View</span>
            </button>
          </div>

          <Button variant="primary" size="sm" icon={Plus} onClick={() => setIsAddModalOpen(true)}>
            Add Product
          </Button>
        </div>
      </div>

      {/* NETFLIX CINEMATIC BOX GRID VIEW */}
      {viewMode === 'grid' ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span className="font-semibold text-slate-700">Top Service Releases ({products.length})</span>
            <span>Hover on a box to inspect pricing & quick actions</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((prod) => {
              const isSubscribed = subscribedIds.includes(prod.id);
              const fallbackImg =
                prod.image ||
                'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80';

              return (
                <div
                  key={prod.id}
                  onClick={() => setSelectedProduct(prod)}
                  className="group relative bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
                  style={{ minHeight: '380px' }}
                >
                  {/* Poster Image Background */}
                  <div className="absolute inset-0">
                    <img
                      src={fallbackImg}
                      alt={prod.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-75 group-hover:opacity-60"
                    />
                    {/* Dark Cinema Gradients */}
                    <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/70 to-slate-950/20" />
                  </div>

                  {/* TOP HEADER ON THE BOX */}
                  <div className="relative z-10 p-5 flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {/* Netflix-style Red Brand Logo Marker */}
                      <span className="w-6 h-6 rounded bg-red-600 text-white font-black text-xs flex items-center justify-center tracking-tighter shadow-md shadow-red-600/50">
                        B
                      </span>
                      {prod.badge && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-600/90 text-white shadow-xs backdrop-blur-xs">
                          {prod.badge}
                        </span>
                      )}
                    </div>

                    {/* TOP RIGHT CORNER: Match Rating */}
                    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-900/80 text-emerald-400 border border-emerald-500/30 backdrop-blur-md">
                      <Sparkles className="w-3 h-3 text-emerald-400" />
                      <span>{prod.rating || '98% Match'}</span>
                    </div>
                  </div>

                  {/* UNIQUE PRICE BADGE (Floating neon cinema ticket) */}
                  <div className="relative z-10 px-5 my-auto">
                    <div className="inline-block bg-slate-900/90 border border-blue-500/40 rounded-xl p-3 shadow-lg backdrop-blur-md">
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-white tracking-tight">
                          {formatCurrency(prod.salesPrice)}
                        </span>
                        <span className="text-xs font-medium text-blue-300">/ month</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                        <span>Cost: {formatCurrency(prod.costPrice)}</span>
                        <span>•</span>
                        <span className="text-emerald-400 font-semibold">
                          {Math.round(((prod.salesPrice - prod.costPrice) / prod.salesPrice) * 100)}% Margin
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* BOTTOM INFO & ACTION CONTROLS */}
                  <div className="relative z-10 p-5 space-y-3 bg-linear-to-t from-slate-950 via-slate-950/90 to-transparent pt-6">
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors tracking-tight">
                        {prod.name}
                      </h3>
                      <p className="text-xs text-slate-300 line-clamp-2 mt-1 leading-snug">
                        {prod.description}
                      </p>
                    </div>

                    {/* KEY FEATURES (SHOWN BY DEFAULT) */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                      <div className="flex items-center justify-between text-[10px] font-bold text-blue-400">
                        <span className="flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-blue-400" /> Included Features
                        </span>
                        <span className="text-[9px] text-slate-400 font-normal">Standard</span>
                      </div>
                      <div className="space-y-1">
                        {(prod.features || [
                          'Visual Sales Pipeline & Lead Kanban',
                          'Automated Invoicing & Tax Engine',
                          'Enterprise High-Speed SLA'
                        ]).slice(0, 3).map((feat, fIdx) => (
                          <div key={fIdx} className="flex items-center gap-1.5 text-[11px] text-slate-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span className="truncate">{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Metadata Tags: Ultra SLA, Variants */}
                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                      <span className="border border-slate-700 px-1.5 py-0.5 rounded text-slate-300 font-semibold">
                        SaaS-18+
                      </span>
                      <span className="border border-slate-700 px-1.5 py-0.5 rounded text-slate-300 font-semibold">
                        4K SLA
                      </span>
                      <span className="text-blue-400 font-medium">{prod.code}</span>
                    </div>

                    {/* Netflix Action Buttons */}
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={(e) => toggleSubscribe(prod.id, e)}
                        className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md ${
                          isSubscribed
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                            : 'bg-white hover:bg-slate-200 text-slate-950'
                        }`}
                      >
                        {isSubscribed ? (
                          <>
                            <Check className="w-3.5 h-3.5 stroke-3" />
                            <span>Subscribed</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>Subscribe</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProduct(prod);
                        }}
                        className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-white border border-slate-700 transition-colors"
                        title="View Details"
                      >
                        <Info className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Classic Data Table View */
        <DataTable
          columns={columns}
          data={products}
          searchKey="name"
          searchPlaceholder="Search products by title or code..."
          filterOptions={['Available', 'Archived']}
          filterKey="status"
        />
      )}

      {/* NETFLIX-STYLE PRODUCT DETAIL MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl text-white relative">
            {/* Top Close Button */}
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-950/70 hover:bg-slate-900 text-slate-300 hover:text-white flex items-center justify-center border border-slate-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Cinematic Banner */}
            <div className="relative h-56 w-full">
              <img
                src={
                  selectedProduct.image ||
                  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80'
                }
                alt={selectedProduct.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/40 to-transparent" />
              <div className="absolute bottom-4 left-6 right-6">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-600 text-white uppercase tracking-wider">
                  {selectedProduct.badge || 'Netflix SaaS Featured'}
                </span>
                <h2 className="text-2xl font-black text-white mt-1">{selectedProduct.name}</h2>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">{selectedProduct.rating || '98% Match'}</span>
                  <span className="border border-slate-700 px-1.5 py-0.5 rounded text-slate-400">SaaS-18+</span>
                  <span className="text-slate-400">{selectedProduct.type}</span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold text-white">
                    {formatCurrency(selectedProduct.salesPrice)}
                  </span>
                  <span className="text-slate-400 block text-[10px]">per monthly billing cycle</span>
                </div>
              </div>

              <p className="text-slate-300 leading-relaxed text-sm">
                {selectedProduct.description}
              </p>

              {/* Included Features Checklist */}
              {selectedProduct.features && selectedProduct.features.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <p className="font-semibold text-blue-400 uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Key Features & Capabilities Included
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedProduct.features.map((feat, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-2 rounded-lg bg-slate-950/70 border border-slate-800 text-slate-200"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="font-medium text-xs leading-snug">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Variants Pill List */}
              <div>
                <p className="font-semibold text-slate-400 mb-2 uppercase text-[10px] tracking-wider">
                  Available Tiers & Deployment Modes
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.variants?.map((v, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium"
                    >
                      {v}
                    </span>
                  ))}
                </div>
              </div>

              {/* Cost & Margin Metrics */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <div>
                  <span className="text-slate-500 block text-[10px]">Infrastructure Cost</span>
                  <span className="text-slate-200 font-semibold">{formatCurrency(selectedProduct.costPrice)}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Status & SKU</span>
                  <span className="text-blue-400 font-mono font-semibold">{selectedProduct.code}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    toggleSubscribe(selectedProduct.id);
                    setSelectedProduct(null);
                  }}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-colors shadow-lg shadow-red-600/30"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>
                    {subscribedIds.includes(selectedProduct.id) ? 'Active Subscription' : 'Subscribe Now'}
                  </span>
                </button>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE NEW PRODUCT MODAL */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Catalog Product"
        description="Add a service or software module with Netflix-style box art."
      >
        <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Product Name *</label>
              <input
                type="text"
                placeholder="e.g. AI Copilot Accelerator"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.name ? 'border-rose-300 focus:ring-rose-400' : 'border-slate-300 focus:ring-blue-500'
                }`}
              />
              {errors.name && <p className="text-rose-500 text-[11px] mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Product SKU / Code</label>
              <input
                type="text"
                placeholder="e.g. BL-AI"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Product Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="Service / SaaS">Service / SaaS</option>
                <option value="Add-on License">Add-on License</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Service / SLA">Service / SLA</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Sales Price ($) *</label>
              <input
                type="number"
                step="0.01"
                placeholder="199.00"
                value={formData.salesPrice}
                onChange={(e) => setFormData({ ...formData, salesPrice: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.salesPrice ? 'border-rose-300 focus:ring-rose-400' : 'border-slate-300 focus:ring-blue-500'
                }`}
              />
              {errors.salesPrice && <p className="text-rose-500 text-[11px] mt-1">{errors.salesPrice}</p>}
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Cost Price ($)</label>
              <input
                type="number"
                step="0.01"
                placeholder="40.00"
                value={formData.costPrice}
                onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Cover Image URL (Box Art)</label>
            <input
              type="text"
              placeholder="https://images.unsplash.com/..."
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Variants (comma separated)</label>
            <input
              type="text"
              placeholder="e.g. Standard, Pro, Enterprise"
              value={formData.variants}
              onChange={(e) => setFormData({ ...formData, variants: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Description</label>
            <textarea
              rows={2}
              placeholder="Product synopsis and subscription highlights..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save to Catalog
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default ProductsPage;
