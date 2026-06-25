import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import AdminPanelSettingsOutlined from '@mui/icons-material/AdminPanelSettingsOutlined';
import PersonOutlined from '@mui/icons-material/PersonOutlined';
import EngineeringOutlined from '@mui/icons-material/EngineeringOutlined';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import type { Role } from '../types';

const ROLE_HOME: Record<Role, string> = { admin: '/admin', lead: '/lead', ic: '/ic' };

export default function RoleSwitcher() {
  const { role, setRole } = useAppContext();
  const navigate = useNavigate();

  function handleChange(_: unknown, v: Role | null) {
    if (!v) return;
    setRole(v);
    navigate(ROLE_HOME[v]);
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
        Demo role:
      </Typography>
      <ToggleButtonGroup
        value={role}
        exclusive
        size="small"
        onChange={handleChange}
        sx={{ '& .MuiToggleButton-root': { py: 0.5, px: 1.5, textTransform: 'none' } }}
      >
        <ToggleButton value="admin">
          <AdminPanelSettingsOutlined sx={{ fontSize: 16, mr: 0.5 }} />
          Admin
        </ToggleButton>
        <ToggleButton value="lead">
          <EngineeringOutlined sx={{ fontSize: 16, mr: 0.5 }} />
          Lead
        </ToggleButton>
        <ToggleButton value="ic">
          <PersonOutlined sx={{ fontSize: 16, mr: 0.5 }} />
          IC
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}
