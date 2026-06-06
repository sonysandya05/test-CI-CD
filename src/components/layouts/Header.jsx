import {
  AppstoreOutlined,
  DownOutlined,
  LogoutOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Dropdown, Tooltip } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AppTypography from '../typography/Typography';
import { logout } from '../../services/dropdownApi';
import { ZinInbox } from '../../assets/images';

function capitalizeName(value) {
  if (!value || typeof value !== 'string') return 'User';

  return value
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function getInitials(value) {
  const parts = (value || 'User').split(' ').filter(Boolean);
  const first = parts[0]?.charAt(0) || 'U';
  const last = parts.length > 1 ? parts.at(-1)?.charAt(0) : '';

  return `${first}${last}`.toUpperCase();
}

function getAvatarColor(name) {
  const firstLetter = (name || 'User').charAt(0).toUpperCase();
  const storedMap = JSON.parse(localStorage.getItem('colorMap') || '{}');

  if (storedMap[firstLetter]) return storedMap[firstLetter];

  const colors = ['#0053a5', '#1677ff', '#15803d', '#f97316', '#6366f1', '#8b5cf6'];
  const color = colors[firstLetter.charCodeAt(0) % colors.length];
  localStorage.setItem('colorMap', JSON.stringify({ ...storedMap, [firstLetter]: color }));

  return color;
}

export default function Header({ leftOffset }) {
  const navigate = useNavigate();
  const location = useLocation();
  const companyName = localStorage.getItem('companyName') || 'Zinnext';
  const username = localStorage.getItem('userName') || localStorage.getItem('preferred_Username') || 'User';
  const preferredUsername = localStorage.getItem('preferred_Username') || username;
  const roleId = localStorage.getItem('roleId') || '';
  const displayName = capitalizeName(username);
  const initials = getInitials(displayName);

  function handleLogoutClick() {
    logout();
    navigate('/login', { replace: true });
  }

  const profileItems = [
    {
      key: 'profile-name',
      label: (
        <div className="app-layout-profile-summary">
          <Avatar
            size={42}
            style={{ backgroundColor: getAvatarColor(displayName) }}
          >
            {initials}
          </Avatar>
          <div className="app-layout-profile-copy">
            <AppTypography variant="body-strong" truncate className="app-layout-profile-name">
              {displayName}
            </AppTypography>
            {roleId && (
              <AppTypography variant="caption" color="secondary" className="app-layout-profile-role">
                {roleId}
              </AppTypography>
            )}
          </div>
        </div>
      ),
      disabled: true,
    },
    { type: 'divider' },
    {
      key: 'dashboard',
      label: (
        <Link to="/dashboard" className="app-layout-menu-link">
          <AppstoreOutlined />
          Dashboard
        </Link>
      ),
    },
    {
      key: 'my-profile',
      label: (
        <Link to="/my-profile" className="app-layout-menu-link">
          <UserOutlined />
          My Profile
        </Link>
      ),
    },
    { type: 'divider' },
    {
      key: 'logout',
      label: (
        <span className="app-layout-menu-link app-layout-menu-danger">
          <LogoutOutlined />
          Logout
        </span>
      ),
      onClick: handleLogoutClick,
    },
  ];

  return (
    <header className="app-layout-header" style={{ left: leftOffset }}>
      <div className="app-layout-company">
        <AppTypography variant="body-strong" truncate className="app-layout-company-name">
          {companyName}
        </AppTypography>
      </div>

      <div className="app-layout-header-actions">
        <Tooltip title="Inbox">
          <Link
            to="/inbox"
            className={location.pathname === '/inbox' ? 'app-layout-icon-btn is-active' : 'app-layout-icon-btn'}
            aria-label="Inbox"
          >
            <img src={ZinInbox} alt="" aria-hidden="true" className="app-layout-icon-img" />
          </Link>
        </Tooltip>

        <div className="app-layout-header-divider" />

        <div className="app-layout-user">
          <Avatar
            size={30}
            style={{ backgroundColor: getAvatarColor(displayName) }}
          >
            {initials}
          </Avatar>
          <AppTypography variant="label" truncate className="app-layout-user-name">
            {preferredUsername}
          </AppTypography>
          <Dropdown
            menu={{ items: profileItems }}
            trigger={['click']}
            placement="bottomRight"
            overlayClassName="app-layout-user-dropdown"
          >
            <button type="button" className="app-layout-dropdown-btn" aria-label="Open user menu">
              <DownOutlined />
            </button>
          </Dropdown>
        </div>
      </div>
    </header>
  );
}
