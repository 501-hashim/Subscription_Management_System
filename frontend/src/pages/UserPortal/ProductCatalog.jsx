import React, { useState, useEffect } from 'react';
import { 
  Package, Layers, Check, Sparkles, ArrowRight, ShieldCheck, 
  Search, Filter, Zap, Server, Sliders, CheckCircle2, ChevronRight,
  Eye, ArrowUpDown, Loader2, Play, Info, List, Grid3X3
} from 'lucide-react';
import { ProductDetailModal } from './ProductDetailModal';
import { userApi } from '../../services/userApi';
import { formatCurrency } from '../../utils/formatters';

// The 3 official catalog products
const OFFICIAL_THREE_PRODUCTS = [
  {
    id: 'PROD-001',
    name: 'CRM Software',
    code: 'BL-CRM',
    type: 'Customer Management SaaS',
    category: 'CRM Software',
    salesPrice: 199.00,
    costPrice: 45.00,
    startingPrice: 199.00,
    status: 'Available',
    badge: 'Top Rated CRM',
    
    description: 'Comprehensive Customer Relationship Management (CRM) platform with visual sales pipelines, lead nurturing, customer tracking, and team collaboration.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80',
    features: [
      'Visual Sales Pipeline & Deal Stages',
      'Automated Inbound Lead Capture',
      'Customer 360° Activity History',
      'Email & Calendar Integration',
      'Deal Forecast Analytics'
    ],
    tags: ['SaaS', '99.9% SLA', 'BL-CRM'],
    availablePlans: ['Starter Plan ($49/mo)', 'Professional CRM ($199/mo)', 'Enterprise Scale ($499/mo)'],
    plansCount: 3,
    plans: [
      {
        id: 'PLAN-001',
        name: 'Starter Plan',
        price: 49.00,
        billingFrequency: 'Monthly',
        features: ['Up to 1,000 active leads', 'Visual sales pipeline', 'Email integration', 'Standard lead capture', 'Daily sync'],
        status: 'Active'
      },
      {
        id: 'PLAN-002',
        name: 'Growth Professional',
        price: 199.00,
        billingFrequency: 'Monthly',
        features: ['Up to 25,000 active contacts', 'Automated lead nurturing sequences', 'Multi-pipeline deal stages', 'Priority email support', 'Deal forecast analytics'],
        status: 'Active'
      },
      {
        id: 'PLAN-003',
        name: 'Enterprise Scale',
        price: 499.00,
        billingFrequency: 'Monthly',
        features: ['Unlimited contacts & pipelines', 'Dedicated Account Executive', 'Custom REST API integrations', 'Cohort churn forecasting', '99.99% SLA'],
        status: 'Active'
      }
    ]
  },
  {
    id: 'PROD-002',
    name: 'Accounting Software',
    code: 'BL-ACCT',
    type: 'Financial & Ledger Software',
    category: 'Accounting Software',
    salesPrice: 149.00,
    costPrice: 30.00,
    startingPrice: 149.00,
    status: 'Available',
    badge: 'Tax & Invoicing',
    
    description: 'Automated corporate accounting, statutory VAT/tax compliance, automated expense tracking, balance sheets, and real-time P&L reporting.',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=900&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=900&q=80',
    features: [
      'Automated VAT / Tax & Invoicing Engine',
      'Real-time Balance Sheet & P&L Statements',
      'Multi-Currency Bank Reconciliation',
      'Expense Categorization & Audit Trail',
      'Statutory Tax Compliance Reports'
    ],
    tags: ['SaaS', '24/7 SLA', 'BL-ACCT'],
    availablePlans: ['Standard Ledger ($99/mo)', 'Tax & Invoicing Pro ($149/mo)', 'Multi-Entity Auditor ($399/mo)'],
    plansCount: 3,
    plans: [
      {
        id: 'PLAN-004',
        name: 'Standard Ledger',
        price: 99.00,
        billingFrequency: 'Monthly',
        features: ['Automated corporate accounting', 'Statutory tax & expense logs', 'Single-entity P&L statements', 'Receipt attachment OCR'],
        status: 'Active'
      },
      {
        id: 'PLAN-005',
        name: 'Tax & Invoicing Pro',
        price: 149.00,
        billingFrequency: 'Monthly',
        features: ['Automated statutory VAT / Tax engine', 'Real-time balance sheet & P&L', 'Multi-currency bank feeds', 'Automated recurring invoice generation'],
        status: 'Active'
      },
      {
        id: 'PLAN-006',
        name: 'Multi-Entity Enterprise',
        price: 399.00,
        billingFrequency: 'Monthly',
        features: ['Multi-entity consolidated balance sheets', 'Auditor export package', 'Automated tax compliance filing', 'Dedicated controller support'],
        status: 'Active'
      }
    ]
  },
  {
    id: 'PROD-003',
    name: 'Cloud Storage',
    code: 'BL-STOR',
    type: 'Encrypted Cloud Storage',
    category: 'Cloud Storage',
    salesPrice: 79.00,
    costPrice: 18.00,
    startingPrice: 79.00,
    status: 'Available',
    badge: 'Encrypted NVMe',
    
    description: 'Ultra-secure encrypted cloud storage with automated backup snapshots, geo-redundant distribution, instant file sync, and 99.999% durability.',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=900&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=900&q=80',
    features: [
      'End-to-End AES-256 Data Encryption',
      'Multi-Region Geo-Redundant Replication',
      'High-Throughput S3 REST API',
      'Automated Daily Snapshot Backups',
      '99.999% Durability SLA'
    ],
    tags: ['SaaS', '99.99% SLA', 'BL-STOR'],
    availablePlans: ['1 TB Secure Cloud ($29/mo)', '10 TB Team Storage ($79/mo)', 'Unlimited S3 Enterprise ($249/mo)'],
    plansCount: 3,
    plans: [
      {
        id: 'PLAN-007',
        name: '1 TB Secure NVMe',
        price: 29.00,
        billingFrequency: 'Monthly',
        features: ['1 TB encrypted storage', 'Automated daily backups', 'Web & mobile sync', 'AES-256 encryption at rest'],
        status: 'Active'
      },
      {
        id: 'PLAN-008',
        name: '10 TB Team Storage',
        price: 79.00,
        billingFrequency: 'Monthly',
        features: ['10 TB team storage', 'Multi-region geo replication', 'High-throughput S3 REST API', 'Instant multi-device file sync'],
        status: 'Active'
      },
      {
        id: 'PLAN-009',
        name: 'Unlimited Enterprise S3',
        price: 249.00,
        billingFrequency: 'Monthly',
        features: ['Unlimited NVMe cloud storage', 'Custom retention policies', 'Dedicated direct connect bandwidth', '99.999% durability SLA'],
        status: 'Active'
      }
    ]
  }
];

export function ProductCatalog({ 
  onSelectProduct, 
  onSelectPlan 
}) {
  const [products, setProducts] = useState(OFFICIAL_THREE_PRODUCTS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('price_asc'); // price_asc, price_desc, name
  
  // Selected product for Details Modal
  const [detailsProduct, setDetailsProduct] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  const categories = ['All', 'CRM Software', 'Accounting Software', 'Cloud Storage'];

  // Fetch products from backend API (merging with official fallback to guarantee accuracy)
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await userApi.getProducts({
        search: searchQuery,
        category: activeCategory,
        sort: sortBy,
      });

      if (data && data.length > 0) {
        // Enrich data with badges, ratings, and features if missing
        const enriched = data.map((item) => {
          const match = OFFICIAL_THREE_PRODUCTS.find(
            (p) => p.id === item.id || p.code === item.code || p.name.toLowerCase() === item.name.toLowerCase()
          );
          return {
            ...item,
            image: item.imageUrl || item.image || match?.image,
            badge: item.badge || match?.badge || 'SaaS Solution',
            status: item.status || 'Active',
            costPrice: item.costPrice || match?.costPrice || Math.round(item.salesPrice * 0.25),
            features: item.features && item.features.length > 0 ? item.features : (match?.features || []),
            tags: match?.tags || ['SaaS', item.code],
            plans: item.plans || match?.plans || [],
          };
        });
        setProducts(enriched);
      } else {
        // Fallback filter locally
        let filtered = [...OFFICIAL_THREE_PRODUCTS];
        if (activeCategory !== 'All') {
          filtered = filtered.filter((p) => p.category === activeCategory || p.name.includes(activeCategory));
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          filtered = filtered.filter(
            (p) => p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
          );
        }
        setProducts(filtered);
      }
    } catch (err) {
      console.warn('[ProductCatalog] Backend offline, using official three products:', err.message);
      let filtered = [...OFFICIAL_THREE_PRODUCTS];
      if (activeCategory !== 'All') {
        filtered = filtered.filter((p) => p.category === activeCategory || p.name.includes(activeCategory));
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (p) => p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
        );
      }
      setProducts(filtered);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchQuery, activeCategory, sortBy]);

  const handleOpenDetails = async (prod) => {
    try {
      const full = await userApi.getProductById(prod.id);
      if (full) {
        const match = OFFICIAL_THREE_PRODUCTS.find((p) => p.id === prod.id || p.code === prod.code);
        setDetailsProduct({
          ...full,
          plans: full.plans && full.plans.length > 0 ? full.plans : match?.plans || [],
          features: full.features && full.features.length > 0 ? full.features : match?.features || [],
        });
      } else {
        const match = OFFICIAL_THREE_PRODUCTS.find((p) => p.id === prod.id || p.code === prod.code) || prod;
        setDetailsProduct(match);
      }
      setDetailsModalOpen(true);
    } catch {
      const match = OFFICIAL_THREE_PRODUCTS.find((p) => p.id === prod.id || p.code === prod.code) || prod;
      setDetailsProduct(match);
      setDetailsModalOpen(true);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Catalog Header */}
      <div className="pb-3 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Product Catalog</h1>
      </div>

      {/* Catalog Search & Category Filter Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search bar & Sort dropdown */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800"
              />
            </div>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium cursor-pointer"
              >
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="py-12 text-center space-y-2">
          <Loader2 className="w-7 h-7 text-blue-600 animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-medium">Updating catalog feed...</p>
        </div>
      )}

      {/* Products Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span className="font-semibold text-slate-700">Available Products ({products.length})</span>
            <span>Hover on a product to inspect pricing & specifications</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((prod) => {
              const fallbackImg =
                prod.image ||
                prod.imageUrl ||
                'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80';

              const salesPrice = parseFloat(prod.salesPrice || prod.startingPrice || 199);
              const costPrice = parseFloat(prod.costPrice || Math.round(salesPrice * 0.25));
              const marginPercent = Math.round(((salesPrice - costPrice) / salesPrice) * 100);

              return (
                <div
                  key={prod.id}
                  className="group relative bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
                  style={{ minHeight: '400px' }}
                >
                  {/* Poster Image Background */}
                  <div className="absolute inset-0">
                    <img
                      src={fallbackImg}
                      alt={prod.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-70 group-hover:opacity-55"
                    />
                    {/* Ambient Gradients */}
                    <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/75 to-slate-950/25" />
                  </div>

                  {/* PRICE BADGE */}
                  <div className="relative z-10 p-5">
                    <div className="inline-block bg-slate-900/90 border border-blue-500/40 rounded-xl p-3 shadow-lg backdrop-blur-md">
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-white tracking-tight">
                          {formatCurrency(salesPrice)}
                        </span>
                        <span className="text-xs font-medium text-blue-300">/ month</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                        <span>Cost: {formatCurrency(costPrice)}</span>
                        <span>•</span>
                        <span className="text-emerald-400 font-semibold">
                          {marginPercent}% Margin
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* BOTTOM INFO & ACTION CONTROLS */}
                  <div className="relative z-10 p-5 space-y-3 bg-linear-to-t from-slate-950 via-slate-950/95 to-transparent pt-6">
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors tracking-tight">
                        {prod.name}
                      </h3>
                      <p className="text-xs text-slate-300 line-clamp-2 mt-1 leading-snug">
                        {prod.description}
                      </p>
                    </div>

                    {/* Feature bullet checklist if available */}
                    {prod.features && prod.features.length > 0 && (
                      <div className="space-y-1 pt-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                          <Check className="w-3 h-3 text-emerald-400" /> Included Features:
                        </span>
                        <div className="grid grid-cols-1 gap-0.5 text-[11px] text-slate-200">
                          {prod.features.slice(0, 2).map((feat, idx) => (
                            <div key={idx} className="flex items-center gap-1.5 truncate">
                              <span className="w-1 h-1 rounded-full bg-blue-400 shrink-0" />
                              <span className="truncate">{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Metadata Tags: Ultra SLA, Variants */}
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 pt-1">
                      <span className="border border-slate-700 px-1.5 py-0.5 rounded text-slate-300 font-semibold">
                        SaaS
                      </span>
                      <span className="border border-slate-700 px-1.5 py-0.5 rounded text-slate-300 font-semibold">
                        24/7 SLA
                      </span>
                      <span className="text-blue-400 font-medium">{prod.code}</span>
                    </div>

                    {/* Action Buttons: Subscribe & Info */}
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => onSelectProduct && onSelectProduct(prod)}
                        className="flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md bg-white hover:bg-slate-200 text-slate-950 cursor-pointer"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>Subscribe</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenDetails(prod)}
                        className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
                        title="View Detailed Plan Specifications"
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

      {/* Details & Plan Comparison Modal */}
      <ProductDetailModal
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        product={detailsProduct}
        onSelectPlan={(prod, plan) => {
          onSelectPlan && onSelectPlan(prod, plan);
        }}
      />

    </div>
  );
}

export default ProductCatalog;
