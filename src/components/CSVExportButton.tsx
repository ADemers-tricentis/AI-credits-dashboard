import Button from '@mui/material/Button';
import Tooltip from '@tricentis/aura/components/Tooltip.js';
import IconUploadOutlined from '@tricentis/aura/components/IconUploadOutlined.js';
import { CREDIT_EVENTS } from '../data/mock';
import { useAppContext } from '../context/AppContext';

export default function CSVExportButton() {
  const { role } = useAppContext();
  if (role !== 'admin') return null;

  function handleExport() {
    const headers = ['user_id', 'timestamp', 'credits', 'agent_id', 'product_id', 'project_id'];
    const rows = CREDIT_EVENTS.map((e) =>
      [e.userId, e.timestamp, e.credits, e.agentId, e.productId, e.projectId].join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-credit-usage-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Tooltip title="Export raw event data as CSV (admin only)">
      <Button
        variant="outlined"
        size="small"
        startIcon={<IconUploadOutlined />}
        onClick={handleExport}
      >
        Export CSV
      </Button>
    </Tooltip>
  );
}
