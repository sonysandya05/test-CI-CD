import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar, { SIDEBAR_COLLAPSED_WIDTH } from './Sidebar';

const HEADER_HEIGHT = 60;

export default function AppShell() {
  const [collapsed, setCollapsed] = useState(true);
  const layoutOffset = SIDEBAR_COLLAPSED_WIDTH;

  return (
    <div className="app-layout-shell">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((value) => !value)} />
      <Header leftOffset={layoutOffset} />

      <main
        className="app-layout-main"
        style={{
          marginLeft: layoutOffset,
          paddingTop: HEADER_HEIGHT,
        }}
      >
        <div className="app-layout-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
