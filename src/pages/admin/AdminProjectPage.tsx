import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import LinearProgress from '@mui/material/LinearProgress';
import SearchOutlined from '@mui/icons-material/SearchOutlined';
import BreadcrumbsItem from '@tricentis/aura/components/BreadcrumbsItem.js';
import TextFieldCollapsible from '@tricentis/aura/components/TextFieldCollapsible.js';
import Tag from '@tricentis/aura/components/Tag.js';
import BurnRateCard from '../../components/BurnRateCard';
import UserRankingTable from '../../components/UserRankingTable';
import CSVExportButton from '../../components/CSVExportButton';
import DateRangeFilter from '../../components/DateRangeFilter';
import { PROJECTS, PRODUCTS, DAILY_USAGE } from '../../data/mock';
import { useAppContext } from '../../context/AppContext';

export default function AdminProjectPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const { burnRateWindow, setBurnRateWindow } = useAppContext();
  const [memberSearch, setMemberSearch] = useState('');

  const project = PROJECTS.find((p) => p.id === projectId);
  if (!project) return <Typography>Project not found.</Typography>;

  const product = PRODUCTS.find((p) => p.id === project.productId)!;
  const pct = project.budget > 0 ? project.creditsUsed / project.budget : 0;
  const progressColor = pct >= 0.9 ? 'error' : pct >= 0.75 ? 'warning' : 'success';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Breadcrumbs>
        <BreadcrumbsItem label="Dashboard" component={Link} to="/admin" />
        <BreadcrumbsItem label={product.name} component={Link} to={`/admin/products/${product.id}`} />
        <Typography color="text.primary">{project.name}</Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <DateRangeFilter />
      </Box>

      {/* Project summary card */}
      <Card variant="outlined">
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 1 }}>
            <Box>
              <Typography variant="h6" fontWeight={700}>{project.name}</Typography>
              <Tag label={product.name} color="primary" size="small" sx={{ mt: 0.5 }} />
              {project.isTeam && <Tag label="Team" color="warning" size="small" sx={{ mt: 0.5, ml: 0.5 }} />}
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="h4" fontWeight={700}>{project.creditsUsed.toLocaleString()}</Typography>
              <Typography variant="body2" color="text.secondary">of {project.budget.toLocaleString()} budget</Typography>
            </Box>
          </Box>
          <Box sx={{ mt: 2 }}>
            <LinearProgress
              variant="determinate"
              value={Math.min(pct * 100, 100)}
              color={progressColor}
              sx={{ height: 8, borderRadius: 4 }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
              {Math.round(pct * 100)}% utilized - {project.memberIds.length} members
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Burn rate */}
      <BurnRateCard
        label={project.name}
        used={project.creditsUsed}
        budget={project.budget}
        renewalDate="2027-03-31"
        dailyUsage={DAILY_USAGE[project.productId] ?? []}
        window={burnRateWindow}
        onWindowChange={setBurnRateWindow}
      />

      {/* User ranking */}
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            Member Rankings ({project.memberIds.length} members)
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <CSVExportButton level="user" projectId={project.id} />
            <TextFieldCollapsible
              placeholder="Search members"
              value={memberSearch}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMemberSearch(e.target.value)}
              size="small"
              icon={<SearchOutlined fontSize="small" />}
              tooltipTitle="Search members"
            />
          </Box>
        </Box>
        <Card variant="outlined">
          <UserRankingTable
            projectId={project.id}
            totalBudget={project.budget}
            searchQuery={memberSearch}
          />
        </Card>
      </Box>
    </Box>
  );
}
