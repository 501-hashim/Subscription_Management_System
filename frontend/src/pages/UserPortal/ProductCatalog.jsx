import React, { useState, useEffect } from 'react';
import { 
  Package, Layers, Check, Sparkles, ArrowRight, ShieldCheck, 
  Search, Filter, Zap, Server, Sliders, CheckCircle2, ChevronRight,
  Eye, ArrowUpDown, Loader2
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { ProductDetailModal } from './ProductDetailModal';
import { userApi } from '../../services/userApi';
import { formatCurrency } from '../../utils/formatters';

export function ProductCatalog({ 
  onSelectProduct, 
  onSelectPlan 
}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('price_asc'); // price_asc, price_desc, name
  
  // Selected product for Details Modal
  const [detailsProduct, setDetailsProduct] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  const categories = ['All', 'Service / SaaS', 'Add-on License', 'Infrastructure', 'Service / SLA'];

  // Fetch products from backend API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await userApi.getProducts({
        search: searchQuery,
        category: activeCategory,
        sort: sortBy,
      });
      setProducts(data);
    } catch (err) {
      console.error('[ProductCatalog Error]:', err);
      setError('Failed to load products from database.');
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
      setDetailsProduct(full);
      setDetailsModalOpen(true);
    } catch (err) {
      setDetailsProduct(prod);
      setDetailsModalOpen(true);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-blue-700 via-indigo-700 to-slate-900 text-white p-8 sm:p-10 shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 backdrop-blur-md border border-blue-400/30 text-xs font-semibold text-blue-200">
            <Sparkles className="w-3.5 h-3.5" />
            Live PostgreSQL Product Catalog
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Enterprise Products & Multi-Tier Plans
          </h1>
          <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed">
            Browse published solutions created by the system administrator. Inspect specifications, compare tiers, and activate your subscription in seconds.
          </p>
        </div>

        {/* Glow decoration */}
        <div className="absolute right-0 top-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
      </div>

      {/* Catalog Search, Filter & Sort Controls */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
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
                placeholder="Search products by name or code..."
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

        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>Displaying <strong>{products.length}</strong> active published products</span>
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Dynamic Express + PostgreSQL Feed
          </span>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-medium">Fetching published catalog items from server...</p>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs text-center">
          {error}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && products.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 space-y-3">
          <Package className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">No products match your criteria</h3>
          <p className="text-xs text-slate-400">Try modifying your search query or switching categories.</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setActiveCategory('All');
              setSearchQuery('');
            }}
          >
            Reset Filters
          </Button>
        </div>
      )}

      {/* Products Grid */}
      {!loading && !error && products.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((prod) => (
            <Card 
              key={prod.id}
              className="flex flex-col justify-between hover:border-blue-400 hover:shadow-lg transition-all duration-200 group overflow-hidden"
            >
              <div>
                {/* Product Image */}
                {prod.imageUrl ? (
                  <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                    <img
                      src={prod.imageUrl}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full shadow-xs border border-white/50">
                        {prod.category || prod.type}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="h-32 bg-slate-100 flex items-center justify-center text-slate-400">
                    <Package className="w-10 h-10" />
                  </div>
                )}

                {/* Card Content */}
                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {prod.name}
                      </h3>
                      <span className="text-[11px] font-mono text-slate-400">{prod.code}</span>
                    </div>
                    <Badge status={prod.status || 'Available'} />
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 min-h-[2.5rem]">
                    {prod.description}
                  </p>

                  {/* Starting price */}
                  <div className="flex items-baseline gap-1.5 pt-2 border-t border-slate-100">
                    <span className="text-[11px] text-slate-400 font-semibold uppercase">Plans from:</span>
                    <span className="text-2xl font-black text-slate-900">
                      {formatCurrency(prod.startingPrice || prod.salesPrice)}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">/mo</span>
                  </div>

                  {/* Available plans tags */}
                  {prod.availablePlans && prod.availablePlans.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Included Tiers:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {prod.availablePlans.map((planName, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-semibold border border-blue-100"
                          >
                            {planName}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-5 pt-0 grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="justify-center text-xs font-semibold cursor-pointer"
                  onClick={() => handleOpenDetails(prod)}
                >
                  <Eye className="w-3.5 h-3.5 mr-1" /> View Details
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  className="justify-center text-xs font-bold cursor-pointer"
                  onClick={() => onSelectProduct && onSelectProduct(prod)}
                >
                  Subscribe <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

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
