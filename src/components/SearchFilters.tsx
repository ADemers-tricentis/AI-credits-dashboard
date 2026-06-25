import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Tooltip from '@tricentis/aura/components/Tooltip.js';
import SearchOutlined from '@mui/icons-material/SearchOutlined';
import ClearOutlined from '@mui/icons-material/ClearOutlined';

type Props = {
  projectQuery: string;
  userQuery: string;
  onProjectChange: (v: string) => void;
  onUserChange: (v: string) => void;
};

export default function SearchFilters({ projectQuery, userQuery, onProjectChange, onUserChange }: Props) {
  const hasClear = projectQuery || userQuery;

  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
      <TextField
        size="small"
        placeholder="Filter by project or product"
        value={projectQuery}
        onChange={(e) => onProjectChange(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchOutlined sx={{ fontSize: 18 }} />
            </InputAdornment>
          ),
        }}
        sx={{ minWidth: 240 }}
      />
      <TextField
        size="small"
        placeholder="Filter by user"
        value={userQuery}
        onChange={(e) => onUserChange(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchOutlined sx={{ fontSize: 18 }} />
            </InputAdornment>
          ),
        }}
        sx={{ minWidth: 200 }}
      />
      {hasClear && (
        <Tooltip title="Clear filters">
          <IconButton size="small" onClick={() => { onProjectChange(''); onUserChange(''); }}>
            <ClearOutlined fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
}
