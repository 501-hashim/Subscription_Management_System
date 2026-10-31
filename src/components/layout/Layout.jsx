import React, { useState } from 'react';
import { Sidebar, navItems } from './Sidebar';
import { Navbar } from './Navbar';

export function Layout({
  activeTab,
  onSelectTab,
  children,
  currentUser,
  onLogout,
  users,
  onSwitchUser,
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  const currentItem = navItems.find((item) => item.id === activeTab) || navItems[0];

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-800">
      <Sidebar
        activeTab={activeTab}
        onSelectTab={onSelectTab}
        isCollapsed={isCollapsed}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          activeTitle={currentItem.label}
          onToggleSidebar={() => setIsCollapsed(!isCollapsed)}
          globalSearch={globalSearch}
          setGlobalSearch={setGlobalSearch}
          currentUser={currentUser}
          onLogout={onLogout}
          onSelectTab={onSelectTab}
          users={users}
          onSwitchUser={onSwitchUser}
        />

        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
