import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import ProductBucketCard from '../../components/ProductBucketCard';
import BurnRateCard from '../../components/BurnRateCard';
import AlertsFeed from '../../components/AlertsFeed';
import DateRangeFilter from '../../components/DateRangeFilter';
import { PROJECTS, PRODUCTS, USERS, DAILY_USAGE } from '../../data/mock';
import { useAppContext } from '../../context/AppContext';

export default function LeadDashboardPage() {
  const { currentUserId, burnRateWindow, setBurnRateWindow } = useAppContext();
  const navigate = useNavigate();

  const user = USERS.find((u) => u.id === currentUserId)!;
  const myProjects = PROJECTS.filter((p) => p.memberIds.includes(currentUserId));
  const myProductIds = [...new Set(myProjects.map((p) => p.productId))];
  const myProducts = PRODUCTS.filter((p) => myProductIds.includes(p.id));

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight={700}>My Projects</Typography>
          <Typography variant="body2" color="text.secondary">Showing projects for {user.name}</Typography>
        </Box>
        <DateRangeFilter />
      </Box>

      {myProjects.map((project) => {
        const product = PRODUCTS.find((p) => p.id === project.productId)!;
        return (
          <Box key={project.id}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              {project.name} - {product.name}
            </Typography>
            <BurnRateCard
              label={project.name}
              used={project.creditsUsed}
              budget={project.budget}
              renewalDate="2027-03-31"
              dailyUsage={DAILY_USAGE[project.productId] ?? []}
              window={burnRateWindow}
              onWindowChange={setBurnRateWindow}
            />
          </Box>
        );
      })}

      <Box>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>My Product Buckets</Typography>
        <Grid container spacing={2}>
          {myProducts.map((product) => (
            <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <ProductBucketCard
                product={product}
                onClick={() => navigate(`/lead/project/${myProjects.find((p) => p.productId === product.id)?.id}`)}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      <AlertsFeed />
    </Box>
  );
}
