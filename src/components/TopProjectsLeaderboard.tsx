import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Tag from '@tricentis/aura/components/Tag.js';
import { PROJECTS, PRODUCTS } from '../data/mock';
import { useNavigate } from 'react-router-dom';

const PRODUCT_COLORS: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
  qtest: 'primary',
  neoload: 'info',
  tosca: 'secondary',
  aiworkspace: 'warning',
};

export default function TopProjectsLeaderboard() {
  const navigate = useNavigate();
  const sorted = [...PROJECTS].sort((a, b) => b.creditsUsed - a.creditsUsed).slice(0, 7);
  const max = sorted[0]?.creditsUsed ?? 1;

  return (
    <Card variant="outlined">
      <CardContent sx={{ pb: 0 }}>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Top Projects by Credit Usage
        </Typography>
      </CardContent>
      <List disablePadding>
        {sorted.map((project, i) => {
          const product = PRODUCTS.find((p) => p.id === project.productId)!;
          return (
            <ListItemButton
              key={project.id}
              divider={i < sorted.length - 1}
              onClick={() => navigate(`/admin/projects/${project.id}`)}
              sx={{ px: 2, py: 1.5, gap: 2 }}
            >
              <Typography variant="body2" color="text.secondary" sx={{ minWidth: 20, fontWeight: 600 }}>
                {i + 1}
              </Typography>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Typography variant="body2" fontWeight={500} noWrap>{project.name}</Typography>
                  <Tag
                    label={product.name}
                    color={PRODUCT_COLORS[project.productId]}
                    size="small"
                    sx={{ flexShrink: 0 }}
                  />
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(project.creditsUsed / max) * 100}
                  color={PRODUCT_COLORS[project.productId]}
                  sx={{ height: 4, borderRadius: 2 }}
                />
              </Box>
              <Typography variant="body2" fontWeight={600} sx={{ minWidth: 60, textAlign: 'right' }}>
                {project.creditsUsed.toLocaleString()}
              </Typography>
            </ListItemButton>
          );
        })}
      </List>
    </Card>
  );
}
