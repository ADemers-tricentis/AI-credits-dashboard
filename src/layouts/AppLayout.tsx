import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import NotificationsOutlined from '@mui/icons-material/NotificationsOutlined';
import DashboardOutlined from '@mui/icons-material/DashboardOutlined';
import AccountBalanceWalletOutlined from '@mui/icons-material/AccountBalanceWalletOutlined';
import AssignmentIndOutlined from '@mui/icons-material/AssignmentIndOutlined';
import NavRail from '@tricentis/aura/components/NavRail.js';
import Brand from '@tricentis/aura/components/Brand.js';
import Page from '@tricentis/aura/components/Page.js';
import RoleSwitcher from '../components/RoleSwitcher';
import ChatAgentPanel from '../components/ChatAgentPanel';
import { useAppContext } from '../context/AppContext';
import { ALERTS } from '../data/mock';

const NAV_WIDTH = 240;

export default function AppLayout() {
  const { role } = useAppContext();
  const navigate = useNavigate();
  const path = useLocation().pathname;
  const [navOpen, setNavOpen] = useState(true);

  const unreadCount = ALERTS.filter((a) => !a.isRead).length;

  const adminItems = [
    {
      id: '/admin',
      text: 'Dashboard',
      icon: <DashboardOutlined />,
      selected: path === '/admin',
      onClick: () => navigate('/admin'),
    },
    {
      id: '/admin/budget',
      text: 'Budget',
      icon: <AccountBalanceWalletOutlined />,
      selected: path === '/admin/budget',
      onClick: () => navigate('/admin/budget'),
    },
  ];

  const leadItems = [
    {
      id: '/lead',
      text: 'My Project',
      icon: <DashboardOutlined />,
      selected: path.startsWith('/lead'),
      onClick: () => navigate('/lead'),
    },
  ];

  const icItems = [
    {
      id: '/ic',
      text: 'My Credits',
      icon: <AssignmentIndOutlined />,
      selected: path.startsWith('/ic'),
      onClick: () => navigate('/ic'),
    },
  ];

  const navItems = role === 'admin' ? adminItems : role === 'lead' ? leadItems : icItems;

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Top AppBar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          color: 'text.primary',
        }}
      >
        <Toolbar sx={{ gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Brand sx={{ height: 28 }} />
          </Box>
          <Box sx={{ flex: 1 }} />
          <RoleSwitcher />
          <Badge badgeContent={unreadCount} color="error">
            <IconButton size="small">
              <NotificationsOutlined />
            </IconButton>
          </Badge>
        </Toolbar>
      </AppBar>

      {/* Left NavRail */}
      <Box sx={{ flexShrink: 0, mt: '64px' }}>
        <NavRail
          open={navOpen}
          onToggle={setNavOpen}
          width={NAV_WIDTH}
          clipped
          items={navItems}
          isChangeSelectedDisabled
          toggleTooltips={{ expand: 'Expand navigation', collapse: 'Collapse navigation' }}
        />
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flex: 1,
          mt: '64px',
          overflow: 'auto',
          minWidth: 0,
        }}
      >
        <Page content={<Outlet />} />
      </Box>

      <ChatAgentPanel />
    </Box>
  );
}
