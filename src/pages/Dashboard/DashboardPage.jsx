import React, { useState } from 'react';
import { 
  Users, 
  DollarSign, 
  CreditCard, 
  AlertTriangle, 
  ChevronRight, 
  PlusCircle, 
  Receipt, 
  TrendingUp, 
  Target, 
  Sparkles, 
  Zap, 
  Calendar, 
  GitBranch, 
  Network, 
  Package, 
  Flame, 
  Award, 
  PieChart as PieIcon,
  CircleDot,
  CheckCircle2
} from 'lucide-react';
import { StatsCard } from '../../components/common/StatsCard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export function DashboardPage({
  dashboardData,
  subscriptions = [],
  invoices = [],
  onNavigate,
}) {
  const { kpis } = dashboardData;

  // Interactive Graph Controls
  const [activeMetric, setActiveMetric] = useState('mrr'); // 'mrr' | 'arr' | 'newSubscriptions'
  const [timeRange, setTimeRange] = useState('6M'); // '3M' | '6M'

  // Dendrogram Representation Mode: 'bracket' (Phylogenetic Tree) | 'radial' (Concentric Cluster Rings)
  const [dendroMode, setDendroMode] = useState('bracket');
  const [hoveredNode, setHoveredNode] = useState(null);

  // 6-month historical & forecast dataset
  const chartDatasets = {
    '6M': [
      { month: 'Feb', mrr: 19800, arr: 237600, newSubscriptions: 51, growth: '+7.6%' },
      { month: 'Mar', mrr: 21500, arr: 258000, newSubscriptions: 63, growth: '+8.5%' },
      { month: 'Apr', mrr: 22900, arr: 274800, newSubscriptions: 58, growth: '+6.5%' },
      { month: 'May', mrr: 24700, arr: 296400, newSubscriptions: 74, growth: '+7.8%' },
      { month: 'Jun', mrr: 26200, arr: 314400, newSubscriptions: 82, growth: '+6.1%' },
      { month: 'Jul', mrr: 28450, arr: 341400, newSubscriptions: 95, growth: '+8.6%' },
    ],
    '3M': [
      { month: 'May', mrr: 24700, arr: 296400, newSubscriptions: 74, growth: '+7.8%' },
      { month: 'Jun', mrr: 26200, arr: 314400, newSubscriptions: 82, growth: '+6.1%' },
      { month: 'Jul', mrr: 28450, arr: 341400, newSubscriptions: 95, growth: '+8.6%' },
    ],
  };

  const currentChartData = chartDatasets[timeRange];
  const overdueInvoices = invoices.filter((inv) => inv.status.toLowerCase() === 'overdue');
  const recentSubscriptions = subscriptions.slice(0, 3);

  const currentMrr = 28450;
  const targetMrr = 35000;
  const progressPercent = Math.min(100, Math.round((currentMrr / targetMrr) * 100));

  // Product Dendrogram Data Structure
  const productsDendro = [
    {
      id: 'prod-core',
      name: 'Brightloop Core Suite',
      code: 'BL-CORE',
      category: 'Core SaaS Platforms',
      shareNum: 65,
      share: '65%',
      sales: 18492,
      units: '780 subscriptions',
      badge: '★ Best Seller #1',
      growth: '+14.2% YoY',
      color: '#2563eb', // blue
      ringColor: 'stroke-blue-600',
      fillColor: 'bg-blue-600',
      textColor: 'text-blue-600',
      desc: 'All-in-one recurring revenue billing & contract engine',
    },
    {
      id: 'prod-anly',
      name: 'Advanced Analytics Addon',
      code: 'BL-ANLY',
      category: 'Intelligence & Add-ons',
      shareNum: 20,
      share: '20%',
      sales: 5690,
      units: '420 subscriptions',
      badge: '🔥 Highest Velocity',
      growth: '+24.8% YoY',
      color: '#8b5cf6', // purple
      ringColor: 'stroke-purple-600',
      fillColor: 'bg-purple-600',
      textColor: 'text-purple-600',
      desc: 'Predictive churn and customer LTV forecasting',
    },
    {
      id: 'prod-gate',
      name: 'Dedicated API Gateway',
      code: 'BL-GATE',
      category: 'Dedicated Infrastructure',
      shareNum: 15,
      share: '15%',
      sales: 4268,
      units: '33 subscriptions',
      badge: '⚡ Top Retention (99.9%)',
      growth: '+18.5% YoY',
      color: '#06b6d4', // cyan
      ringColor: 'stroke-cyan-500',
      fillColor: 'bg-cyan-500',
      textColor: 'text-cyan-600',
      desc: 'High-throughput webhook delivery & dedicated VPC',
    },
  ];

  // Tooltip for Revenue Graph
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 border border-slate-700/80 p-3.5 rounded-xl shadow-2xl backdrop-blur-md text-white min-w-[170px] animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="font-bold text-xs text-slate-200">{label} 2025</span>
            <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
              {data.growth}
            </span>
          </div>
          <div className="space-y-1.5 pt-2 text-xs">
            {activeMetric === 'mrr' && (
              <div>
                <span className="text-slate-400 block text-[10px]">Monthly Recurring (MRR)</span>
                <span className="font-extrabold text-base text-blue-400">{formatCurrency(data.mrr)}</span>
              </div>
            )}
            {activeMetric === 'arr' && (
              <div>
                <span className="text-slate-400 block text-[10px]">Annual Run Rate (ARR)</span>
                <span className="font-extrabold text-base text-indigo-400">{formatCurrency(data.arr)}</span>
              </div>
            )}
            {activeMetric === 'newSubscriptions' && (
              <div>
                <span className="text-slate-400 block text-[10px]">New Contracts Added</span>
                <span className="font-extrabold text-base text-emerald-400">+{data.newSubscriptions} accounts</span>
              </div>
            )}
            <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-800/80">
              Annualized: {formatCurrency(data.mrr * 12)}
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Executive Dashboard</h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
              <Zap className="w-3 h-3 text-blue-600 fill-current" />
              SaaS Engine
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Product sales dendrogram breakdown paired with real-time revenue velocity.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('invoices')}
            className="text-xs"
          >
            <Receipt className="w-3.5 h-3.5 mr-1 text-slate-500" />
            + New Invoice
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onNavigate('subscriptions')}
            className="text-xs shadow-xs"
          >
            <PlusCircle className="w-3.5 h-3.5 mr-1" />
            + New Subscription
          </Button>
        </div>
      </div>

      {/* Overdue Invoices Alert Banner */}
      {overdueInvoices.length > 0 && (
        <div className="flex items-center justify-between p-3.5 rounded-xl border border-amber-200 bg-amber-50/70 text-xs shadow-xs">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="font-medium text-amber-900">
              {overdueInvoices.length} past-due invoice totaling{' '}
              <strong className="font-bold">
                {formatCurrency(overdueInvoices.reduce((sum, inv) => sum + inv.amount, 0))}
              </strong>{' '}
              requires follow-up.
            </span>
          </div>
          <button
            onClick={() => onNavigate('invoices')}
            className="text-amber-900 font-bold hover:underline flex items-center gap-1 text-xs"
          >
            <span>Review Overdue</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 4 Core KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Monthly Recurring (MRR)"
          value={formatCurrency(currentMrr)}
          change="+8.6%"
          trend="up"
          subtitle="vs last month"
          icon={DollarSign}
        />
        <StatsCard
          title="Active Subscriptions"
          value={kpis.activeSubscriptions.value.toLocaleString()}
          change="+12.4%"
          trend="up"
          subtitle="active contracts"
          icon={Users}
        />
        <StatsCard
          title="Outstanding Receivables"
          value={formatCurrency(kpis.outstandingPayments.value)}
          change="-4.1%"
          trend="down"
          subtitle="pending payment"
          icon={CreditCard}
        />
        <StatsCard
          title="Overdue Invoices"
          value={overdueInvoices.length}
          change={formatCurrency(overdueInvoices.reduce((sum, inv) => sum + inv.amount, 0))}
          trend="alert"
          subtitle="past due"
          icon={AlertTriangle}
        />
      </div>

      {/* SPLIT SECTION: LEFT = PRODUCT DENDROGRAM | RIGHT = REVENUE TRAJECTORY GRAPH */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN (5 of 12): DENDROGRAM PRODUCT SALES BREAKDOWN */}
        <Card className="xl:col-span-5 border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
          <CardHeader className="p-4 pb-3 border-b border-slate-100 flex flex-row items-center justify-between bg-slate-50/50">
            <div>
              <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-indigo-600" />
                Product Sales Dendrogram
              </CardTitle>
              <CardDescription className="text-[11px] text-slate-500">
                Hierarchical phylogenetic clustering of catalog revenue
              </CardDescription>
            </div>

            {/* Representation Switcher */}
            <div className="bg-slate-200/80 p-0.5 rounded-lg flex items-center border border-slate-300">
              <button
                onClick={() => setDendroMode('bracket')}
                title="Phylogenetic Tree View"
                className={`px-2 py-1 rounded text-[10px] font-bold transition-all flex items-center gap-1 ${
                  dendroMode === 'bracket'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <GitBranch className="w-3 h-3" />
                <span>Tree</span>
              </button>
              <button
                onClick={() => setDendroMode('radial')}
                title="Radial Cluster Rings"
                className={`px-2 py-1 rounded text-[10px] font-bold transition-all flex items-center gap-1 ${
                  dendroMode === 'radial'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <PieIcon className="w-3 h-3" />
                <span>Radial</span>
              </button>
            </div>
          </CardHeader>

          <CardContent className="p-4 flex-1 space-y-4">
            
            {/* REPRESENTATION 1: PHYLOGENETIC BRACKET DENDROGRAM (True Orthogonal Tree) */}
            {dendroMode === 'bracket' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                {/* Visual Orthogonal Bracket Diagram with Interactive Product Nodes */}
                <div className="relative pt-1">
                  
                  {/* Root Node Header */}
                  <div className="flex items-center justify-between mb-3 bg-slate-900 text-white p-2.5 px-3.5 rounded-xl border border-slate-800 shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-blue-600/40 text-blue-300 flex items-center justify-center font-bold text-xs border border-blue-400/30">
                        <Network className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-bold">Catalog Root Node</span>
                    </div>
                    <span className="text-xs font-extrabold text-emerald-400 font-mono">
                      {formatCurrency(currentMrr)} (100%)
                    </span>
                  </div>

                  {/* Orthogonal Bracket Tree SVG + HTML Nodes */}
                  <div className="relative pl-6 space-y-3.5 before:absolute before:left-3 before:top-2 before:bottom-6 before:w-0.5 before:bg-slate-300">
                    {productsDendro.map((prod, index) => {
                      const isHovered = hoveredNode === prod.id;

                      return (
                        <div
                          key={prod.id}
                          onMouseEnter={() => setHoveredNode(prod.id)}
                          onMouseLeave={() => setHoveredNode(null)}
                          className={`relative pl-4 transition-all duration-200 cursor-pointer ${
                            hoveredNode && !isHovered ? 'opacity-60' : 'opacity-100'
                          }`}
                        >
                          {/* Horizontal Dendrogram Branch Arm with Distance Dot */}
                          <div className="absolute -left-3 top-5 w-4 h-0.5 bg-slate-300" />
                          <div 
                            className="absolute -left-1 top-4 w-2 h-2 rounded-full border-2 border-white shadow-xs"
                            style={{ backgroundColor: prod.color }} 
                          />

                          {/* Product Box Leaf Node */}
                          <div className={`p-3 rounded-xl border transition-all ${
                            isHovered 
                              ? 'bg-blue-50/70 border-blue-400 shadow-md ring-1 ring-blue-300' 
                              : 'bg-white border-slate-200 shadow-xs hover:border-slate-300'
                          }`}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span 
                                  className="w-2.5 h-2.5 rounded-full shrink-0" 
                                  style={{ backgroundColor: prod.color }} 
                                />
                                <div>
                                  <h4 className="text-xs font-bold text-slate-900 leading-tight">
                                    {prod.name}
                                  </h4>
                                  <span className="text-[10px] text-slate-400 font-medium">
                                    {prod.category} • {prod.units}
                                  </span>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="text-xs font-black text-slate-900 block font-mono">
                                  {formatCurrency(prod.sales)}
                                </span>
                                <span className="text-[10px] font-bold text-emerald-600">
                                  {prod.share} share
                                </span>
                              </div>
                            </div>

                            {/* Relative Weight Distance Line */}
                            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden mt-2.5">
                              <div 
                                className="h-1.5 rounded-full transition-all duration-500"
                                style={{ 
                                  width: `${prod.shareNum}%`, 
                                  backgroundColor: prod.color 
                                }}
                              />
                            </div>

                            <div className="flex items-center justify-between pt-2 mt-1.5 border-t border-slate-100 text-[10px]">
                              <span className="font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                                {prod.badge}
                              </span>
                              <span className="text-slate-500 font-medium">{prod.growth}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Phylogenetic Distance Scale (Horizontal Axis) */}
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>0% Cluster</span>
                    <span className="text-slate-300">─── 25% ───</span>
                    <span className="text-slate-300">─── 50% ───</span>
                    <span>100% Volume</span>
                  </div>
                </div>
              </div>
            )}

            {/* REPRESENTATION 2: RADIAL CONCENTRIC CLUSTERS (Target Rings View) */}
            {dendroMode === 'radial' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                {/* Radial Concentric Rings Visual */}
                <div className="flex flex-col items-center justify-center py-2">
                  <div className="relative w-44 h-44 flex items-center justify-center">
                    {/* Outer Ring: Core Suite (65%) */}
                    <div className="absolute inset-0 rounded-full border-4 border-dashed border-blue-500/40 animate-spin-slow" />
                    <div className="absolute inset-2 rounded-full border-4 border-blue-600/70" />

                    {/* Middle Ring: Analytics (20%) */}
                    <div className="absolute inset-7 rounded-full border-4 border-purple-500/80" />

                    {/* Inner Ring: Dedicated API Gateway (15%) */}
                    <div className="absolute inset-12 rounded-full border-4 border-cyan-400" />

                    {/* Center Core Hub */}
                    <div className="relative z-10 w-16 h-16 rounded-full bg-slate-900 text-white flex flex-col items-center justify-center text-center p-1 shadow-lg border border-slate-700">
                      <span className="text-[9px] font-bold text-blue-400">TOTAL</span>
                      <span className="text-[11px] font-black leading-tight">$28.4k</span>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium mt-2">
                    Concentric Cluster Hierarchy by Revenue Volume
                  </span>
                </div>

                {/* Legend Chips */}
                <div className="space-y-2 pt-1 border-t border-slate-100">
                  {productsDendro.map((prod) => (
                    <div 
                      key={prod.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span 
                          className="w-3 h-3 rounded-full shrink-0" 
                          style={{ backgroundColor: prod.color }} 
                        />
                        <span className="font-bold text-slate-800">{prod.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900">{formatCurrency(prod.sales)}</span>
                        <span className="text-[10px] font-bold text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                          {prod.share}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Performance Summary Banner */}
            <div className="p-2.5 px-3 bg-blue-50/70 rounded-xl border border-blue-100 text-[11px] text-blue-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-blue-600 shrink-0" />
                <span>
                  <strong>Core Suite</strong> is the primary revenue anchor ({productsDendro[0].share} volume).
                </span>
              </div>
              <span className="text-[10px] font-bold text-blue-700 bg-white px-2 py-0.5 rounded shadow-2xs">
                Top Tier
              </span>
            </div>
          </CardContent>
        </Card>

        {/* RIGHT COLUMN (7 of 12): REVENUE VELOCITY GRAPH (SHIFTED RIGHT) */}
        <Card className="xl:col-span-7 border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
          {/* Graph Header: Title, Metric Switchers, and Period Selectors */}
          <div className="p-4 pb-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-linear-to-b from-slate-50/50 to-white">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  Recurring Revenue Velocity
                </CardTitle>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  +14.2% YoY
                </span>
              </div>
              <CardDescription className="text-[11px] text-slate-500 mt-0.5">
                Monthly revenue trajectory & subscriber velocity
              </CardDescription>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              {/* Metric Switcher: MRR / ARR / Net Subscribers */}
              <div className="bg-slate-100 p-0.5 rounded-lg flex items-center border border-slate-200">
                <button
                  onClick={() => setActiveMetric('mrr')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                    activeMetric === 'mrr'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  MRR
                </button>
                <button
                  onClick={() => setActiveMetric('arr')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                    activeMetric === 'arr'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  ARR
                </button>
                <button
                  onClick={() => setActiveMetric('newSubscriptions')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                    activeMetric === 'newSubscriptions'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Volume
                </button>
              </div>

              {/* Time Range Selector */}
              <div className="bg-slate-100 p-0.5 rounded-lg flex items-center border border-slate-200">
                <button
                  onClick={() => setTimeRange('3M')}
                  className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all ${
                    timeRange === '3M'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  3M
                </button>
                <button
                  onClick={() => setTimeRange('6M')}
                  className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all ${
                    timeRange === '6M'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  6M
                </button>
              </div>
            </div>
          </div>

          {/* 3 Telemetry Metrics */}
          <div className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100 bg-slate-50/30 text-xs">
            <div className="p-2.5 px-4">
              <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block">
                ARPU (Avg / User)
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-sm font-extrabold text-slate-900">$199.20</span>
                <span className="text-[10px] text-emerald-600 font-bold">+4.2%</span>
              </div>
            </div>
            <div className="p-2.5 px-4">
              <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block">
                Net Retention (NRR)
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-sm font-extrabold text-slate-900">108.5%</span>
                <span className="text-[10px] text-emerald-600 font-bold">Tier 1</span>
              </div>
            </div>
            <div className="p-2.5 px-4">
              <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block">
                Collection Rate
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-sm font-extrabold text-slate-900">97.8%</span>
                <span className="text-[10px] text-blue-600 font-bold">Healthy</span>
              </div>
            </div>
          </div>

          {/* The Visual Chart Canvas */}
          <CardContent className="pt-4 pb-2 flex-1 min-h-[260px]">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={currentChartData} margin={{ top: 10, right: 10, left: -5, bottom: 0 }}>
                  <defs>
                    <linearGradient id="auroraRevenueGradient3" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.35} />
                      <stop offset="60%" stopColor="#6366f1" stopOpacity={0.12} />
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#94a3b8" 
                    fontSize={11} 
                    fontWeight={500}
                    tickLine={false} 
                    axisLine={{ stroke: '#e2e8f0' }} 
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => 
                      activeMetric === 'newSubscriptions' ? `${val}` : `$${val >= 1000 ? `${val / 1000}k` : val}`
                    }
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey={activeMetric}
                    stroke="#2563eb"
                    strokeWidth={2.5}
                    dot={{ r: 3.5, fill: '#2563eb', strokeWidth: 2, stroke: '#ffffff' }}
                    activeDot={{ r: 5, fill: '#1d4ed8', stroke: '#ffffff', strokeWidth: 2 }}
                    fillOpacity={1}
                    fill="url(#auroraRevenueGradient3)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>

          {/* Milestone Goal Progress Bar */}
          <div className="p-3 px-5 border-t border-slate-100 bg-slate-50/40 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <Target className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-slate-800 text-[11px]">
                Q4 Target: $35,000 MRR ({progressPercent}% achieved)
              </span>
            </div>
            <div className="w-32 bg-slate-200 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-linear-to-r from-blue-600 to-indigo-500 h-1.5 rounded-full transition-all duration-500" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </Card>
      </div>

      {/* LIVE SUBSCRIPTION REGISTRY */}
      <Card>
        <CardHeader className="flex items-center justify-between p-4 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm font-bold text-slate-900">Active Subscription Contracts</CardTitle>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {subscriptions.length} Live
              </span>
            </div>
            <CardDescription className="text-xs">
              Live recurring contracts, automated billing cadence, and renewal schedules.
            </CardDescription>
          </div>
          <button
            onClick={() => onNavigate('subscriptions')}
            className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1"
          >
            <span>Manage All Contracts</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 uppercase text-[10px] tracking-wider border-y border-slate-100">
              <tr>
                <th className="py-2.5 px-4 font-semibold">Subscriber / Account</th>
                <th className="py-2.5 px-4 font-semibold">Tier Plan</th>
                <th className="py-2.5 px-4 font-semibold">Billing Schedule</th>
                <th className="py-2.5 px-4 font-semibold">Contract Value</th>
                <th className="py-2.5 px-4 font-semibold text-right">Lifecycle Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentSubscriptions.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-linear-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                        {sub.customer.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block">{sub.customer}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{sub.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-700">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[11px] font-medium border border-slate-200">
                      {sub.plan}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>Renews {formatDate(sub.nextBillingDate)}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-extrabold text-slate-900">
                    {formatCurrency(sub.amount)}
                    <span className="text-[10px] font-normal text-slate-400">/{sub.billingCycle.toLowerCase()}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Badge status={sub.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export default DashboardPage;
