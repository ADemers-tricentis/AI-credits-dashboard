import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import BurnRateCard from '../../components/BurnRateCard';
import ICAttributionTable from '../../components/ICAttributionTable';
import DateRangeFilter from '../../components/DateRangeFilter';
import { PROJECTS, PRODUCTS, USERS, CREDIT_EVENTS, DAILY_USAGE } from '../../data/mock';
import { useAppContext } from '../../context/AppContext';

export default function ICDashboardPage() {
  const { currentUserId, burnRateWindow, setBurnRateWindow } = useAppContext();
  const user = USERS.find((u) => u.id === currentUserId)!;

  const myEvents = CREDIT_EVENTS.filter((e) => e.userId === currentUserId);
  const totalCredits = myEvents.reduce((s, e) => s + e.credits, 0);

  const myProjects = PROJECTS.filter((p) => p.memberIds.includes(currentUserId));
  const primaryProject = myProjects[0];
  const primaryProduct = primaryProject ? PRODUCTS.find((p) => p.id === primaryProject.productId) : null;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight={700}>My Credits</Typography>
          <Typography variant="body2" color="text.secondary">{user.name} - {user.email}</Typography>
        </Box>
        <DateRangeFilter />
      </Box>

      {/* Personal summary */}
      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="caption" color="text.secondary">Total Credits Used</Typography>
          <Typography variant="h4" fontWeight={700}>{totalCredits.toLocaleString()}</Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">Total Requests</Typography>
          <Typography variant="h4" fontWeight={700}>{myEvents.length}</Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">Products</Typography>
          <Typography variant="h4" fontWeight={700}>{[...new Set(myEvents.map((e) => e.productId))].length}</Typography>
        </Box>
      </Box>

      {/* Burn rate - scoped to primary project */}
      {primaryProject && (
        <BurnRateCard
          label={`${primaryProject.name} (your primary project)`}
          used={primaryProject.creditsUsed}
          budget={primaryProject.budget}
          renewalDate="2027-03-31"
          dailyUsage={DAILY_USAGE[primaryProject.productId] ?? []}
          window={burnRateWindow}
          onWindowChange={setBurnRateWindow}
        />
      )}

      {/* Attribution table */}
      <Box>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>My Credits by Product & Project</Typography>
        <Card variant="outlined">
          <ICAttributionTable />
        </Card>
      </Box>
    </Box>
  );
}
