import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AccountBalanceWalletOutlined from '@mui/icons-material/AccountBalanceWalletOutlined';
import ProductBucketCard from '../../components/ProductBucketCard';
import BurnRateCard from '../../components/BurnRateCard';
import TopProjectsLeaderboard from '../../components/TopProjectsLeaderboard';
import AlertsFeed from '../../components/AlertsFeed';
import DateRangeFilter from '../../components/DateRangeFilter';
import CSVExportButton from '../../components/CSVExportButton';
import BudgetAllocationDrawer from '../../components/BudgetAllocationDrawer';
import { PRODUCTS, TENANT, DAILY_USAGE } from '../../data/mock';
import { useAppContext } from '../../context/AppContext';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { burnRateWindow, setBurnRateWindow } = useAppContext();
  const [budgetDrawerOpen, setBudgetDrawerOpen] = useState(false);

  const totalUsed = PRODUCTS.reduce((s, p) => s + p.used, 0);
  const allDailyUsage = Object.values(DAILY_USAGE).flat();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight={700}>AI Credit Usage</Typography>
          <Typography variant="body2" color="text.secondary">{TENANT.name}</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
          <DateRangeFilter />
          <CSVExportButton />
          <Button
            variant="outlined"
            size="small"
            startIcon={<AccountBalanceWalletOutlined />}
            onClick={() => setBudgetDrawerOpen(true)}
          >
            Manage Budget
          </Button>
        </Box>
      </Box>

      {/* Tenant burn-rate card */}
      <BurnRateCard
        label="Tenant"
        used={totalUsed}
        budget={TENANT.totalCredits}
        renewalDate={TENANT.renewalDate}
        dailyUsage={allDailyUsage}
        window={burnRateWindow}
        onWindowChange={setBurnRateWindow}
      />

      {/* Product bucket cards */}
      <Box>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>Product Buckets</Typography>
        <Grid container spacing={2}>
          {PRODUCTS.map((product) => (
            <Grid key={product.id} size={{ xs: 12, sm: 6, lg: 3 }}>
              <ProductBucketCard
                product={product}
                onClick={() => navigate(`/admin/products/${product.id}`)}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Leaderboard + Alerts */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 7 }}>
          <TopProjectsLeaderboard />
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <AlertsFeed />
        </Grid>
      </Grid>

      <BudgetAllocationDrawer open={budgetDrawerOpen} onClose={() => setBudgetDrawerOpen(false)} />
    </Box>
  );
}
