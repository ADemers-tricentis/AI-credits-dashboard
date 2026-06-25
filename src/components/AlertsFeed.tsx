import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import NotificationItem from '@tricentis/aura/components/NotificationItem.js';
import WarningAmberOutlined from '@mui/icons-material/WarningAmberOutlined';
import ErrorOutlined from '@mui/icons-material/ErrorOutlined';
import { ALERTS, PRODUCTS } from '../data/mock';

function formatRelative(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function AlertsFeed() {
  const unread = ALERTS.filter((a) => !a.isRead);
  const read = ALERTS.filter((a) => a.isRead);

  function renderAlert(alert: typeof ALERTS[0]) {
    const product = PRODUCTS.find((p) => p.id === alert.productId);
    const pct = product ? product.used / product.budget : 0;
    const icon = pct >= 0.9
      ? <ErrorOutlined color="error" />
      : <WarningAmberOutlined color="warning" />;

    return (
      <NotificationItem
        key={alert.id}
        icon={icon}
        title={product?.name}
        body={alert.message}
        subBody={formatRelative(alert.triggeredAt)}
        isRead={alert.isRead}
      />
    );
  }

  return (
    <Card variant="outlined">
      <CardContent sx={{ pb: 0 }}>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Alerts {unread.length > 0 && `(${unread.length} unread)`}
        </Typography>
      </CardContent>
      <Box>
        {unread.map(renderAlert)}
        {read.map(renderAlert)}
        {ALERTS.length === 0 && (
          <Box sx={{ px: 2, py: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">No alerts</Typography>
          </Box>
        )}
      </Box>
    </Card>
  );
}
