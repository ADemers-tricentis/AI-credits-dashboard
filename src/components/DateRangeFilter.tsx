import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { useAppContext } from '../context/AppContext';
import type { DateRange } from '../types';

export default function DateRangeFilter() {
  const { dateRange, setDateRange } = useAppContext();

  return (
    <ToggleButtonGroup
      value={dateRange}
      exclusive
      size="small"
      onChange={(_, v: DateRange | null) => { if (v) setDateRange(v); }}
      sx={{ '& .MuiToggleButton-root': { py: 0.5, px: 1.5, textTransform: 'none', fontSize: 13 } }}
    >
      <ToggleButton value="day">Day</ToggleButton>
      <ToggleButton value="week">Week</ToggleButton>
      <ToggleButton value="month">Month</ToggleButton>
      <ToggleButton value="custom">Custom</ToggleButton>
    </ToggleButtonGroup>
  );
}
