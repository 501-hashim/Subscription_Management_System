import React, { useState } from 'react';
import { 
  Package, Layers, Check, Sparkles, ArrowRight, ShieldCheck, 
  Search, Filter, Zap, Server, Sliders, CheckCircle2, ChevronRight
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { formatCurrency } from '../../utils/formatters';

export function ProductCatalog({ 
  products = [], 
  plans = [], 
  onSelectProduct, 
  onSelectPlan 
}) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [planBillingCadence, setPlanBillingCadence] = useState('Monthly'); // 'Monthly' or 'Annual'

  const categories = ['All', 'Service / SaaS', 'Add-on License', 'Infrastructure', 'Service / SLA'];

  // Filter products
  const filteredProducts = products.filter((prod) => {
    // Category match
    const matchesCategory = activeCategory === 'All' || prod.type === activeCategory;
    // Search match
    const matchesSearch = 
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (prod.description && prod.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Filter plans according to cadence toggle
  const filteredPlans = plans.filter((p) => p.status === 'Active');

  return (
    <div className="space-y-12">
      
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-blue-700 via-indigo-700 to-slate-900 text-white p-8 sm:p-10 shadow-lg">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 backdrop-blur-md border border-blue-400/30 text-xs font-semibold text-blue-200">
            <Sparkles className="w-3.5 h-3.5" />
            Brightloop Subscription Storefront
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Enterprise SaaS Solutions & Modular Add-ons
          </h1>
          <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed">
            Explore products and flexible subscription plans configured by Brightloop. Choose your tier, configure licenses, and launch your automated billing services in minutes.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <a 
              href="#plans-section" 
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-blue-700 font-bold text-xs shadow-md hover:bg-blue-50 transition-all"
            >
              Browse Subscription Plans <ChevronRight className="w-4 h-4" />
            </a>
            <a 
              href="#products-section" 
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600/60 hover:bg-blue-600 text-white font-semibold text-xs border border-blue-400/30 transition-all"
            >
              View Catalog Products
            </a>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 top-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
        <div className="absolute right-32 bottom-0 -mb-12 w-64 h-64 rounded-full bg-indigo-500/20 blur-2xl pointer-events-none" />
      </div>

      {/* SECTION 1: SUBSCRIPTION PLANS TIERS */}
      <div id="plans-section" className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600">
              <Layers className="w-4 h-4" /> Subscription Plans
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
              Flexible Tiers Built to Scale
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Select the pricing tier that matches your team size and operational volume.
            </p>
          </div>

          {/* Monthly / Annual billing switch */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => setPlanBillingCadence('Monthly')}
              className={`px-4 py-1.5 rounded-lg font-semibold transition-all ${
                planBillingCadence === 'Monthly'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Monthly Billing
            </button>
            <button
              type="button"
              onClick={() => setPlanBillingCadence('Annual')}
              className={`px-4 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                planBillingCadence === 'Annual'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Annual Billing
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                Save 17%
              </span>
            </button>
          </div>
        </div>

        {/* Plan Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlans.map((plan) => {
            const isPopular = plan.name.toLowerCase().includes('growth') || plan.name.toLowerCase().includes('pro');
            const displayPrice = planBillingCadence === 'Annual' 
              ? (plan.billingFrequency === 'Annual' ? plan.price : plan.price * 10) // 10 months charge for annual
              : (plan.billingFrequency === 'Annual' ? Math.round(plan.price / 12) : plan.price);

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col justify-between rounded-2xl bg-white border transition-all duration-200 overflow-hidden ${
                  isPopular
                    ? 'border-blue-500 shadow-lg shadow-blue-500/10 ring-2 ring-blue-500/20'
                    : 'border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-md'
                }`}
              >
                {isPopular && (
                  <div className="bg-blue-600 text-white text-[10px] font-extrabold uppercase tracking-widest text-center py-1.5">
                    Most Popular Choice
                  </div>
                )}

                <div className="p-6 space-y-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
                      <span className="text-[11px] text-slate-400 font-mono">{plan.code}</span>
                    </div>
                    <Badge status={plan.status} />
                  </div>

                  {/* Pricing Display */}
                  <div className="flex items-baseline gap-1.5 pb-4 border-b border-slate-100">
                    <span className="text-4xl font-black text-slate-900">{formatCurrency(displayPrice)}</span>
                    <span className="text-xs text-slate-500 font-medium">
                      /{planBillingCadence.toLowerCase()}
                    </span>
                  </div>

                  {/* Features List */}
                  <div className="space-y-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                      Included Capabilities
                    </span>
                    <ul className="space-y-2.5 text-xs text-slate-600">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Minimum seats: <strong>{plan.minimumQuantity} user(s)</strong></span>
                      </li>
                      {plan.features?.map((f, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <Button
                    variant={isPopular ? 'primary' : 'outline'}
                    size="md"
                    className="w-full justify-center font-bold"
                    onClick={() => onSelectPlan && onSelectPlan(plan, planBillingCadence)}
                  >
                    Subscribe to {plan.name} <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                  <p className="text-[10px] text-slate-400 text-center mt-2">
                    Instant provisioning • Cancel anytime
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: CATALOG PRODUCTS LISTED BY ADMIN */}
      <div id="products-section" className="space-y-6 pt-6 border-t border-slate-200">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600">
              <Package className="w-4 h-4" /> Admin Product Catalog
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
              Modules & Standalone Licenses
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Live products published and maintained by the system administrator.
            </p>
          </div>

          <span className="text-xs text-slate-500 font-medium">
            Showing <strong>{filteredProducts.length}</strong> available products
          </span>
        </div>

        {/* Controls: Search and Category Pills */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          {/* Category tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeCategory === cat
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search products, codes, descriptions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800"
            />
          </div>
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">No products match your criteria</h3>
            <p className="text-xs text-slate-400 mt-1">Try clearing your search query or selecting "All" categories.</p>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setActiveCategory('All');
                setSearchQuery('');
              }}
              className="mt-4"
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((prod) => (
              <Card 
                key={prod.id} 
                className="flex flex-col justify-between hover:border-blue-400 hover:shadow-md transition-all duration-200 group"
              >
                <div>
                  <CardHeader className="bg-slate-50/50 pb-3">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200/50">
                        {prod.type}
                      </span>
                      <CardTitle className="text-base pt-1 group-hover:text-blue-600 transition-colors">
                        {prod.name}
                      </CardTitle>
                      <span className="text-[11px] font-mono text-slate-400 block">{prod.code}</span>
                    </div>
                    <Badge status={prod.status} />
                  </CardHeader>

                  <CardContent className="space-y-4 pt-4">
                    <p className="text-xs text-slate-600 line-clamp-3 min-h-[3rem]">
                      {prod.description || 'Full-featured enterprise subscription component with seamless integration capabilities.'}
                    </p>

                    {/* Pricing */}
                    <div className="flex items-baseline gap-1 pt-2 border-t border-slate-100">
                      <span className="text-2xl font-black text-slate-900">{formatCurrency(prod.salesPrice)}</span>
                      <span className="text-xs text-slate-500 font-medium">/month</span>
                    </div>

                    {/* Available Variants */}
                    {prod.variants && prod.variants.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          Available Variants:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {prod.variants.map((v, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium border border-slate-200"
                            >
                              {v}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </div>

                <div className="p-5 pt-0">
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full justify-center font-bold"
                    onClick={() => onSelectProduct && onSelectProduct(prod)}
                    disabled={prod.status === 'Archived'}
                  >
                    {prod.status === 'Archived' ? 'Currently Unavailable' : 'Order / Subscribe'}
                    {prod.status !== 'Archived' && <ArrowRight className="w-3.5 h-3.5 ml-1" />}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

      </div>

    </div>
  );
}
