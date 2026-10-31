import React, { useState } from 'react';
import { Layout } from './components/layout/Layout';
import { LoginPage } from './pages/Auth/LoginPage';
import { UserPortalPage } from './pages/UserPortal/UserPortalPage';
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
      if (user.role === 'Customer' || user.role === 'user' || user.personaType === 'customer') {
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
    setCurrentUser(null);
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

  // State modification handlers for User Portal actions
  const handleAddSubscription = (newSub, newInvoice, newPayment) => {
    setSubscriptions((prev) => [newSub, ...prev]);
    if (newInvoice) setInvoices((prev) => [newInvoice, ...prev]);
    if (newPayment) setPayments((prev) => [newPayment, ...prev]);

    // Also increment user totalSubscriptions count
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

  // 1. Unauthenticated view: Render the upgraded Login & Registration Page
  if (!isAuthenticated || !currentUser) {
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

  // 2. User view: User Portal (Dedicated self-service interface after login)
  const isUserAccount =
    currentUser?.role === 'Customer' ||
    currentUser?.role === 'user' ||
    currentUser?.role === 'customer' ||
    currentUser?.personaType === 'customer' ||
    currentUser?.id?.startsWith('CUST-') ||
    currentUser?.email?.includes('@acmecorp') ||
    currentUser?.email?.includes('@apexlogistics') ||
    currentUser?.email?.includes('@novatech') ||
    currentUser?.email?.includes('@solardrive');

  if (isUserAccount) {
    return (
      <>
        <CursorFollower enableSpotlight={false} enableCursorDot={true} />
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
          onAddSubscription={handleAddSubscription}
          onToggleAutoRenew={handleToggleAutoRenew}
          onCancelSubscription={handleCancelSubscription}
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
            currentUser={currentUser || users[0]}
            companySettings={companySettings}
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
