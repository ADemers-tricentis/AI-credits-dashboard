import Button from '@mui/material/Button';
import Tooltip from '@tricentis/aura/components/Tooltip.js';
import IconUploadOutlined from '@tricentis/aura/components/IconUploadOutlined.js';
import { CREDIT_EVENTS, PRODUCTS, PROJECTS, USERS, TENANT, getDateRangeStart } from '../data/mock';
import { useAppContext } from '../context/AppContext';
import type { DateRange } from '../types';

export type ExportLevel = 'product' | 'project' | 'user';

type Props = {
  level: ExportLevel;
  productId?: string;
  projectId?: string;
};

function buildCSV(level: ExportLevel, productId: string | undefined, projectId: string | undefined, dateRange: DateRange): string {
  const since = getDateRangeStart(dateRange);
  const rangeEnd = new Date();
  const rangeStartStr = since.toISOString().split('T')[0];
  const rangeEndStr = rangeEnd.toISOString().split('T')[0];

  const filtered = CREDIT_EVENTS.filter((e) => new Date(e.timestamp) >= since);

  if (level === 'product') {
    const headers = ['level', 'tenant_id', 'product_id', 'credits_consumed', 'request_count', 'range_start', 'range_end'];
    const rows = PRODUCTS.map((p) => {
      const events = filtered.filter((e) => e.productId === p.id);
      return [
        'PRODUCT',
        TENANT.id,
        p.id,
        events.reduce((s, e) => s + e.credits, 0),
        events.length,
        rangeStartStr,
        rangeEndStr,
      ].join(',');
    });
    return [headers.join(','), ...rows].join('\n');
  }

  if (level === 'project' && productId) {
    const headers = ['level', 'tenant_id', 'product_id', 'project_id', 'credits_consumed', 'request_count', 'range_start', 'range_end'];
    const rows = PROJECTS.filter((p) => p.productId === productId).map((proj) => {
      const events = filtered.filter((e) => e.projectId === proj.id);
      return [
        'PROJECT',
        TENANT.id,
        productId,
        proj.id,
        events.reduce((s, e) => s + e.credits, 0),
        events.length,
        rangeStartStr,
        rangeEndStr,
      ].join(',');
    });
    return [headers.join(','), ...rows].join('\n');
  }

  if (level === 'user' && projectId) {
    const project = PROJECTS.find((p) => p.id === projectId)!;
    const headers = ['level', 'tenant_id', 'product_id', 'project_id', 'user_id', 'user_email', 'credits_consumed', 'request_count', 'range_start', 'range_end'];
    const rows = project.memberIds.map((uid) => {
      const user = USERS.find((u) => u.id === uid)!;
      const events = filtered.filter((e) => e.userId === uid && e.projectId === projectId);
      return [
        'USER',
        TENANT.id,
        project.productId,
        projectId,
        uid,
        user.email,
        events.reduce((s, e) => s + e.credits, 0),
        events.length,
        rangeStartStr,
        rangeEndStr,
      ].join(',');
    });
    return [headers.join(','), ...rows].join('\n');
  }

  return '';
}

function downloadCSV(csv: string, filename: string) {
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function triggerCSVExport(level: ExportLevel, dateRange: DateRange, productId?: string, projectId?: string) {
  const csv = buildCSV(level, productId, projectId, dateRange);
  if (!csv) return;
  const date = new Date().toISOString().split('T')[0];
  downloadCSV(csv, `ai-credit-usage-${level}-${date}.csv`);
}

export default function CSVExportButton({ level, productId, projectId }: Props) {
  const { role, dateRange } = useAppContext();
  if (role !== 'admin') return null;

  function handleExport() {
    triggerCSVExport(level, dateRange, productId, projectId);
  }

  const levelLabel = level === 'product' ? 'by product' : level === 'project' ? 'by project' : 'by user';

  return (
    <Tooltip title={`Export aggregated credit usage ${levelLabel} as CSV (admin only)`}>
      <Button
        variant="outlined"
        size="small"
        startIcon={<IconUploadOutlined />}
        onClick={handleExport}
      >
        Export credit usage
      </Button>
    </Tooltip>
  );
}
