import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Tag from '@tricentis/aura/components/Tag.js';
import ProductMarkQTest from '@tricentis/aura/components/ProductMarkQTest.js';
import ProductMarkNeoload from '@tricentis/aura/components/ProductMarkNeoload.js';
import ProductMarkTosca from '@tricentis/aura/components/ProductMarkTosca.js';
import IconArtificialIntelligenceOutlined from '@tricentis/aura/components/IconArtificialIntelligenceOutlined.js';
import type { Product } from '../types';

type Props = {
  product: Product;
  onClick?: () => void;
};

function ProductIcon({ id }: { id: string }) {
  switch (id) {
    case 'qtest': return <ProductMarkQTest sx={{ height: 24 }} />;
    case 'neoload': return <ProductMarkNeoload sx={{ height: 24 }} />;
    case 'tosca': return <ProductMarkTosca sx={{ height: 24 }} />;
    case 'aiworkspace': return <IconArtificialIntelligenceOutlined sx={{ fontSize: 24, color: 'primary.main' }} />;
    default: return null;
  }
}

function getStatus(pct: number): { label: string; color: 'success' | 'warning' | 'error'; progressColor: 'success' | 'warning' | 'error' } {
  if (pct >= 0.9) return { label: 'Critical', color: 'error', progressColor: 'error' };
  if (pct >= 0.75) return { label: 'Warning', color: 'warning', progressColor: 'warning' };
  return { label: 'Healthy', color: 'success', progressColor: 'success' };
}

export default function ProductBucketCard({ product, onClick }: Props) {
  const pct = product.used / product.budget;
  const status = getStatus(pct);

  const content = (
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
        <ProductIcon id={product.id} />
        <Tag label={status.label} color={status.color} size="small" />
      </Box>

      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
        {product.name}
      </Typography>

      <Box sx={{ mb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="caption" color="text.secondary">Used</Typography>
          <Typography variant="caption" fontWeight={500}>
            {product.used.toLocaleString()} / {product.budget.toLocaleString()}
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={Math.min(pct * 100, 100)}
          color={status.progressColor}
          sx={{ height: 6, borderRadius: 3 }}
        />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="caption" color="text.secondary" display="block">Utilization</Typography>
          <Typography variant="body2" fontWeight={600}>{Math.round(pct * 100)}%</Typography>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Typography variant="caption" color="text.secondary" display="block">Remaining</Typography>
          <Typography variant="body2" fontWeight={600}>{(product.budget - product.used).toLocaleString()}</Typography>
        </Box>
      </Box>

      {onClick && (
        <Typography variant="caption" color="primary" sx={{ display: 'block', mt: 1.5, fontWeight: 500 }}>
          View Projects →
        </Typography>
      )}
    </CardContent>
  );

  if (onClick) {
    return (
      <Card variant="outlined" sx={{ height: '100%' }}>
        <CardActionArea onClick={onClick} sx={{ height: '100%', alignItems: 'flex-start' }}>
          {content}
        </CardActionArea>
      </Card>
    );
  }

  return <Card variant="outlined">{content}</Card>;
}
