import React, { useState } from 'react';
import { Layout } from './components/layout/Layout';
import { DashboardPage } from './pages/Dashboard/DashboardPage';
import { CustomersPage } from './pages/Customers/CustomersPage';
import { ProductsPage } from './pages/Products/ProductsPage';
import { PlansPage } from './pages/Plans/PlansPage';
import { QuotationsPage } from './pages/Quotations/QuotationsPage';
import { SubscriptionsPage } from './pages/Subscriptions/SubscriptionsPage';
import { InvoicesPage } from './pages/Invoices/InvoicesPage';
import { PaymentsPage } from './pages/Payments/PaymentsPage';
import { DiscountsPage } from './pages/Discounts/DiscountsPage';
import { ReportsPage } from './pages/Reports/ReportsPage';
import { SettingsPage } from './pages/Settings/SettingsPage';
import { UserPortalPage } from './pages/UserPortal/UserPortalPage';
import { LoginPage } from './pages/Auth/LoginPage';

import {
  initialDashboardData,
  initialCustomers,
  initialProducts,
  initialPlans,
  initialQuotations,
  initialSubscriptions,
  initialInvoices,
  initialPayments,
  initialDiscounts,
  initialUsers,
  initialCompanySettings,
} from './data/mockData';

export function App() {
  // Authentication & Session state
  const [currentUser, setCurrentUser] = useState(null); // null = show LoginPage
  const [userRole, setUserRole] = useState('user'); // 'user' or 'admin'
  const [viewMode, setViewMode] = useState('user'); // 'user' or 'admin'
  const [activeTab, setActiveTab] = useState('dashboard');

  // Application state
  const [dashboardData] = useState(initialDashboardData);
  const [customers, setCustomers] = useState(initialCustomers);
  const [products, setProducts] = useState(initialProducts);
  const [plans, setPlans] = useState(initialPlans);
  const [quotations, setQuotations] = useState(initialQuotations);
  const [subscriptions, setSubscriptions] = useState(initialSubscriptions);
  const [invoices, setInvoices] = useState(initialInvoices);
  const [payments, setPayments] = useState(initialPayments);
  const [discounts, setDiscounts] = useState(initialDiscounts);
  const [users, setUsers] = useState(initialUsers);
  const [companySettings, setCompanySettings] = useState(initialCompanySettings);

  // Authentication handlers
  const handleLogin = (user, explicitRole) => {
    setCurrentUser(user);
    const isAdmin =
      explicitRole === 'admin' ||
      user?.role?.toLowerCase()?.includes('admin') ||
      user?.email?.toLowerCase() === 'hashim@brightloop.io';

    const determinedRole = isAdmin ? 'admin' : 'user';
    setUserRole(determinedRole);
    setViewMode(determinedRole);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setUserRole('user');
    setViewMode('user');
  };

  // State modification handlers for Admin
  const handleAddCustomer = (newCustomer) => {
    setCustomers((prev) => [newCustomer, ...prev]);
  };

  const handleAddProduct = (newProduct) => {
    setProducts((prev) => [newProduct, ...products]);
  };

  const handleAddPlan = (newPlan) => {
    setPlans((prev) => [newPlan, ...plans]);
  };

  const handleAddQuotation = (newQuotation) => {
    setQuotations((prev) => [newQuotation, ...quotations]);
  };

  const handleAddInvoice = (newInvoice) => {
    setInvoices((prev) => [newInvoice, ...invoices]);
  };

  const handleAddDiscount = (newDiscount) => {
    setDiscounts((prev) => [newDiscount, ...discounts]);
  };

  const handleAddUser = (newUser) => {
    setUsers((prev) => [newUser, ...users]);
  };

  const handleSaveCompanySettings = (updated) => {
    setCompanySettings(updated);
  };

  // State modification handlers for Customer Portal actions
  const handleAddSubscription = (newSub, newInvoice, newPayment) => {
    setSubscriptions((prev) => [newSub, ...prev]);
    if (newInvoice) setInvoices((prev) => [newInvoice, ...prev]);
    if (newPayment) setPayments((prev) => [newPayment, ...prev]);

    // Also increment customer's totalSubscriptions count
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === newSub.customerId || c.company === newSub.customer || c.name === newSub.customer
          ? { ...c, totalSubscriptions: (c.totalSubscriptions || 0) + 1 }
          : c
      )
    );
  };

  const handleToggleAutoRenew = (subId) => {
    setSubscriptions((prev) =>
      prev.map((s) => (s.id === subId ? { ...s, autoRenew: !s.autoRenew } : s))
    );
  };

  const handleCancelSubscription = (subId) => {
    setSubscriptions((prev) =>
      prev.map((s) =>
        s.id === subId ? { ...s, status: 'Cancelled', autoRenew: false } : s
      )
    );
  };

  const handlePayInvoice = (invoiceId) => {
    const targetInvoice = invoices.find((i) => i.id === invoiceId);
    setInvoices((prev) =>
      prev.map((i) => (i.id === invoiceId ? { ...i, status: 'Paid' } : i))
    );
    if (targetInvoice) {
      const newPay = {
        id: `PAY-${Math.floor(7730 + Math.random() * 500)}`,
        customer: targetInvoice.customer,
        invoiceNumber: targetInvoice.id,
        paymentMethod: 'Credit Card (Instant Settlement)',
        amount: targetInvoice.amount,
        paymentDate: new Date().toLocaleString(),
        status: 'Completed',
        transactionRef: `tx_pay_${Math.random().toString(36).substring(2, 9)}`,
      };
      setPayments((prev) => [newPay, ...prev]);
    }
  };

  const handleAcceptQuotation = (quotationId) => {
    const targetQuote = quotations.find((q) => q.id === quotationId);
    if (!targetQuote) return;

    setQuotations((prev) =>
      prev.map((q) => (q.id === quotationId ? { ...q, status: 'Accepted' } : q))
    );

    const today = new Date().toISOString().split('T')[0];
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const expiryDate = nextMonth.toISOString().split('T')[0];

    const subId = `SUB-${Math.floor(8200 + Math.random() * 1000)}`;
    const invId = `INV-2025-${Math.floor(1095 + Math.random() * 100)}`;
    const payId = `PAY-${Math.floor(7750 + Math.random() * 100)}`;

    const newSub = {
      id: subId,
      customer: targetQuote.customer,
      customerId: targetQuote.customerId,
      plan: targetQuote.products,
      startDate: today,
      expiryDate: expiryDate,
      billingCycle: 'Monthly',
      amount: targetQuote.totalAmount,
      status: 'Active',
      nextBillingDate: expiryDate,
      autoRenew: true,
    };

    const newInvoice = {
      id: invId,
      customer: targetQuote.customer,
      customerId: targetQuote.customerId,
      invoiceDate: today,
      dueDate: today,
      amount: targetQuote.totalAmount,
      status: 'Paid',
      paymentMethod: 'Commercial Purchase Order / Card',
      items: [
        {
          desc: targetQuote.products,
          qty: 1,
          unit: targetQuote.totalAmount,
          total: targetQuote.totalAmount,
        },
      ],
    };

    const newPayment = {
      id: payId,
      customer: targetQuote.customer,
      invoiceNumber: invId,
      paymentMethod: 'Purchase Order / Credit Card',
      amount: targetQuote.totalAmount,
      paymentDate: new Date().toLocaleString(),
      status: 'Completed',
      transactionRef: `tx_quote_${quotationId}`,
    };

    handleAddSubscription(newSub, newInvoice, newPayment);
  };

  // 1. If not authenticated, render Login Page
  if (!currentUser) {
    return (
      <LoginPage
        customers={customers}
        users={users}
        onLogin={handleLogin}
        onRegisterCustomer={handleAddCustomer}
      />
    );
  }

  // 2. If in User Portal mode (post-login user interface):
  if (viewMode === 'user') {
    return (
      <UserPortalPage
        products={products}
        plans={plans}
        subscriptions={subscriptions}
        invoices={invoices}
        payments={payments}
        discounts={discounts}
        customers={customers}
        currentUser={currentUser}
        onLogout={handleLogout}
        onSwitchToAdmin={userRole === 'admin' ? () => setViewMode('admin') : undefined}
        onAddSubscription={handleAddSubscription}
        onToggleAutoRenew={handleToggleAutoRenew}
        onCancelSubscription={handleCancelSubscription}
      />
    );
  }

  // 3. Otherwise in Admin Operations & Billing mode:
  return (
    <Layout
      activeTab={activeTab}
      onSelectTab={setActiveTab}
      currentUser={currentUser}
      onLogout={handleLogout}
    >
      {activeTab === 'dashboard' && (
        <DashboardPage
          dashboardData={dashboardData}
          subscriptions={subscriptions}
          invoices={invoices}
          payments={payments}
          onNavigate={setActiveTab}
        />
      )}

      {activeTab === 'customers' && (
        <CustomersPage
          customers={customers}
          onAddCustomer={handleAddCustomer}
        />
      )}

      {activeTab === 'products' && (
        <ProductsPage
          products={products}
          onAddProduct={handleAddProduct}
        />
      )}

      {activeTab === 'plans' && (
        <PlansPage
          plans={plans}
          onAddPlan={handleAddPlan}
        />
      )}

      {activeTab === 'quotations' && (
        <QuotationsPage
          quotations={quotations}
          customers={customers}
          onAddQuotation={handleAddQuotation}
        />
      )}

      {activeTab === 'subscriptions' && (
        <SubscriptionsPage
          subscriptions={subscriptions}
        />
      )}

      {activeTab === 'invoices' && (
        <InvoicesPage
          invoices={invoices}
          customers={customers}
          onAddInvoice={handleAddInvoice}
        />
      )}

      {activeTab === 'payments' && (
        <PaymentsPage
          payments={payments}
        />
      )}

      {activeTab === 'discounts' && (
        <DiscountsPage
          discounts={discounts}
          onAddDiscount={handleAddDiscount}
        />
      )}

      {activeTab === 'reports' && (
        <ReportsPage
          invoices={invoices}
          subscriptions={subscriptions}
          payments={payments}
        />
      )}

      {activeTab === 'settings' && (
        <SettingsPage
          companySettings={companySettings}
          users={users}
          onSaveCompanySettings={handleSaveCompanySettings}
          onAddUser={handleAddUser}
        />
      )}
    </Layout>
  );
}

export default App;
