import React, { useState } from 'react';
import { Layout } from './components/layout/Layout';
import { LoginPage } from './pages/Auth/LoginPage';
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
  const [activeTab, setActiveTab] = useState('dashboard');

  // Authentication State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('brightloop_admin_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

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

  const handleLogout = () => {
    try {
      localStorage.removeItem('brightloop_admin_session');
    } catch {}
    setCurrentUser(null);
  };

  const handleSwitchUser = (newUser) => {
    try {
      localStorage.setItem('brightloop_admin_session', JSON.stringify(newUser));
    } catch {}
    setCurrentUser(newUser);
  };

  // State modification handlers
  const handleAddCustomer = (newCustomer) => {
    setCustomers([newCustomer, ...customers]);
  };

  const handleAddProduct = (newProduct) => {
    setProducts([newProduct, ...products]);
  };

  const handleAddPlan = (newPlan) => {
    setPlans([newPlan, ...plans]);
  };

  const handleAddQuotation = (newQuotation) => {
    setQuotations([newQuotation, ...quotations]);
  };

  const handleAddInvoice = (newInvoice) => {
    setInvoices([newInvoice, ...invoices]);
  };

  const handleAddDiscount = (newDiscount) => {
    setDiscounts([newDiscount, ...discounts]);
  };

  const handleAddUser = (newUser) => {
    setUsers([newUser, ...users]);
  };

  const handleSaveCompanySettings = (updated) => {
    setCompanySettings(updated);
  };

  if (!currentUser) {
    return <LoginPage onLogin={setCurrentUser} users={users} />;
  }

  return (
    <Layout
      activeTab={activeTab}
      onSelectTab={setActiveTab}
      currentUser={currentUser}
      onLogout={handleLogout}
      users={users}
      onSwitchUser={handleSwitchUser}
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
