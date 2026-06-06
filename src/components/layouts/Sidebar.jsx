import { Layout, Menu } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ZinAdmin,
  ZinArrowClose,
  ZinCampaign,
  ZinCandidate,
  ZinDashboard,
  ZinHelp,
  ZinJobs,
  ZinLogoIcon,
  ZinLogoText,
  ZinNetwork,
  ZinOnBoarding,
  ZinReports,
  ZinScheduler,
  ZinSettings,
  ZinSubmission,
  ZinTimesheet,
} from '../../assets/images';

const { Sider } = Layout;

export const SIDEBAR_WIDTH = 200;
export const SIDEBAR_COLLAPSED_WIDTH = 60;

const iconMap = {
  Dashboard: ZinDashboard,
  Jobs: ZinJobs,
  Candidates: ZinCandidate,
  Submissions: ZinSubmission,
  Network: ZinNetwork,
  Scheduler: ZinScheduler,
  Admin: ZinAdmin,
  Reports: ZinReports,
  Settings: ZinSettings,
  Help: ZinHelp,
  onboarding: ZinOnBoarding,
  Onboarding: ZinOnBoarding,
  timesheet: ZinTimesheet,
  Timesheet: ZinTimesheet,
  campaign: ZinCampaign,
  Campaign: ZinCampaign,
  'test-cases': ZinCampaign,
};

function parseStoredMenu(storageKey) {
  const rawValue = localStorage.getItem(storageKey);

  if (!rawValue || rawValue === 'undefined' || rawValue === 'null' || rawValue.trim() === '') {
    return [];
  }

  try {
    const parsedValue = JSON.parse(rawValue);
    if (Array.isArray(parsedValue)) return parsedValue;
    if (Array.isArray(parsedValue?.menu)) return parsedValue.menu;
    if (Array.isArray(parsedValue?.menus?.menu)) return parsedValue.menus.menu;

    return [];
  } catch (error) {
    console.error(`Error parsing ${storageKey}:`, error);
    return [];
  }
}

function getSelectedKeys(pathname) {
  const cleanPath = pathname.replace(/^\/+/, '');
  if (!cleanPath) return ['dashboard'];

  const parts = cleanPath.split('/');
  return [cleanPath, parts[0], parts.at(-1)].filter(Boolean);
}

function SidebarIcon({ icon }) {
  const iconSrc = iconMap[icon];

  if (!iconSrc) return null;

  return (
    <img
      src={iconSrc}
      alt=""
      className="app-sidebar-menu-icon"
      aria-hidden="true"
    />
  );
}

function buildMenuItems(menuItems) {
  return menuItems.map((item) => ({
    key: item.key,
    icon: <SidebarIcon icon={item.icon} />,
    label: item.label,
    disabled: item.status === 'inactive',
    children: Array.isArray(item.children) ? buildMenuItems(item.children) : undefined,
  }));
}

export default function Sidebar({ collapsed, onToggle }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [openKeys, setOpenKeys] = useState([]);
  const selectedKeys = useMemo(() => getSelectedKeys(location.pathname), [location.pathname]);

  useEffect(() => {
    if (selectedKeys.length > 0) {
      localStorage.setItem('activeKey', selectedKeys[0]);
    }
  }, [selectedKeys]);

  const items = useMemo(() => {
    const storedMenu = parseStoredMenu('menu');
    return buildMenuItems(storedMenu);
  }, []);

  function handleToggle() {
    if (!collapsed) {
      setOpenKeys([]);
    }

    onToggle();
  }

  function handleMenuClick({ key }) {
    navigate(`/${key}`);
  }

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={SIDEBAR_WIDTH}
      collapsedWidth={SIDEBAR_COLLAPSED_WIDTH}
      className="app-sidebar"
    >
      <div className="app-sidebar-panel">
        <div className="app-sidebar-brand">
          <div className="app-sidebar-logo">
            <img src={ZinLogoIcon} alt="" className="app-sidebar-logo-icon" />
            <img src={ZinLogoText} alt="Zinnext" className="app-sidebar-logo-text" />
          </div>
        </div>

        <button
          type="button"
          className="app-sidebar-toggle"
          onClick={handleToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <img src={ZinArrowClose} alt="" aria-hidden="true" />
        </button>

        <div className="app-sidebar-body">
          <Menu
            mode="inline"
            theme="dark"
            selectedKeys={selectedKeys}
            openKeys={collapsed ? [] : openKeys}
            items={items}
            onClick={handleMenuClick}
            onOpenChange={setOpenKeys}
            className="app-sidebar-menu"
          />
        </div>
      </div>
    </Sider>
  );
}
