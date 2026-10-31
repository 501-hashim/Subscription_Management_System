import React, { useState } from 'react';
import { Layout } from './components/layout/Layout';
import { LoginPage } from './pages/Auth/LoginPage';
import { CustomerPortal } from './pages/Portal/CustomerPortal';
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
import { CursorFollower } from './components/common/CursorFollower';

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
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      const explicitOut = localStorage.getItem('brightloop_logged_in') === 'false';
      return !explicitOut;
    } catch {
      return true;
    }
  });

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('brightloop_current_user') || localStorage.getItem('brightloop_admin_session');
      return saved ? JSON.parse(saved) : initialUsers[0];
    } catch {
      return initialUsers[0];
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

  const handleLogin = (user, isNew = false) => {
    if (isNew) {
      if (user.role === 'Customer' || user.personaType === 'customer') {
        setCustomers((prev) => [user, ...prev]);
      } else {
        setUsers((prev) => [user, ...prev]);
      }
      if (user.organization) {
        setCompanySettings((prev) => ({
          ...prev,
          companyName: user.organization,
        }));
      }
    }
    setCurrentUser(user);
    setIsAuthenticated(true);
    try {
      localStorage.setItem('brightloop_logged_in', 'true');
      localStorage.setItem('brightloop_current_user', JSON.stringify(user));
    } catch (e) {
      console.error('LocalStorage write failed:', e);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.setItem('brightloop_logged_in', 'false');
      localStorage.removeItem('brightloop_current_user');
      localStorage.removeItem('brightloop_admin_session');
    } catch (e) {
      console.error('LocalStorage clear failed:', e);
    }
  };

  const handleSwitchUser = (newUser) => {
    try {
      localStorage.setItem('brightloop_admin_session', JSON.stringify(newUser));
      localStorage.setItem('brightloop_current_user', JSON.stringify(newUser));
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

  // 1. Unauthenticated view: Render the upgraded Login & Registration Page
  if (!isAuthenticated) {
    return (
      <>
        <CursorFollower enableSpotlight={true} enableCursorDot={true} />
        <LoginPage
          onLogin={handleLogin}
          availableUsers={users}
          availableCustomers={customers}
        />
      </>
    );
  }

  // 2. Customer view: Customer Portal (Isolated from Admin settings/ops)
  if (currentUser?.role === 'Customer' || currentUser?.personaType === 'customer') {
    return (
      <>
        <CursorFollower enableSpotlight={false} enableCursorDot={true} />
        <CustomerPortal
          customerUser={currentUser}
          subscriptions={subscriptions}
          invoices={invoices}
          payments={payments}
          onLogout={handleLogout}
        />
      </>
    );
  }

  // 3. Admin / Staff view: Complete Operations & Billing Suite
  const isAdmin = currentUser?.role === 'Super Admin';

  return (
    <>
      <CursorFollower enableSpotlight={false} enableCursorDot={true} />
      <Layout
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        currentUser={currentUser || users[0]}
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
          products={products}
          plans={plans}
          discounts={discounts}
          companySettings={companySettings}
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
          isAdmin={isAdmin}
          onSaveCompanySettings={handleSaveCompanySettings}
          onAddUser={handleAddUser}
        />
      )}
    </Layout>
    </>
  );
}

export default App;
