import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import LinearProgress from '@mui/material/LinearProgress';
import TableRowButton from '@mui/material/TableRow';
import MuiAlert from '@mui/material/Alert';
import BreadcrumbsItem from '@tricentis/aura/components/BreadcrumbsItem.js';
import Tag from '@tricentis/aura/components/Tag.js';
import ChipStatus from '@tricentis/aura/components/ChipStatus.js';
import ProductBucketCard from '../../components/ProductBucketCard';
import BurnRateCard from '../../components/BurnRateCard';
import SearchFilters from '../../components/SearchFilters';
import CSVExportButton from '../../components/CSVExportButton';
import { PRODUCTS, PROJECTS, USERS, DAILY_USAGE } from '../../data/mock';
import { useAppContext } from '../../context/AppContext';
import type { ProductId } from '../../types';
import { Link } from 'react-router-dom';

export default function AdminProductPage() {
  const { productId } = useParams<{ productId: ProductId }>();
  const navigate = useNavigate();
  const { burnRateWindow, setBurnRateWindow } = useAppContext();
  const [projectQuery, setProjectQuery] = useState('');
  const [userQuery, setUserQuery] = useState('');

  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product) return <Typography>Product not found.</Typography>;

  const productProjects = PROJECTS.filter((p) => p.productId === productId);

  const filtered = productProjects.filter((proj) => {
    const matchesProject =
      !projectQuery ||
      proj.name.toLowerCase().includes(projectQuery.toLowerCase()) ||
      product.name.toLowerCase().includes(projectQuery.toLowerCase());

    const matchesUser =
      !userQuery ||
      proj.memberIds.some((uid) =>
        USERS.find((u) => u.id === uid)?.name.toLowerCase().includes(userQuery.toLowerCase())
      );

    return matchesProject && matchesUser;
  });

  const isAIWorkspace = productId === 'aiworkspace';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Breadcrumbs>
        <BreadcrumbsItem label="Dashboard" component={Link} to="/admin" />
        <Typography color="text.primary">{product.name}</Typography>
      </Breadcrumbs>

      {isAIWorkspace && (
        <MuiAlert severity="info">
          AI Workspace uses <strong>teams</strong> instead of projects. The project hierarchy shown here maps teams as the equivalent unit.
        </MuiAlert>
      )}

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Box sx={{ minWidth: 280, maxWidth: 320 }}>
          <ProductBucketCard product={product} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 320 }}>
          <BurnRateCard
            label={product.name}
            used={product.used}
            budget={product.budget}
            renewalDate="2027-03-31"
            dailyUsage={DAILY_USAGE[productId!] ?? []}
            window={burnRateWindow}
            onWindowChange={setBurnRateWindow}
          />
        </Box>
      </Box>

      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            {isAIWorkspace ? 'Teams' : 'Projects'} ({filtered.length})
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
            <CSVExportButton level="project" productId={productId} />
            <SearchFilters
              projectQuery={projectQuery}
              userQuery={userQuery}
              onProjectChange={setProjectQuery}
              onUserChange={setUserQuery}
            />
          </Box>
        </Box>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>{isAIWorkspace ? 'Team' : 'Project'}</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>Members</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>Credits Used</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 140 }}>Utilization</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((project) => {
              const pct = project.budget > 0 ? project.creditsUsed / project.budget : 0;
              const statusLabel = pct >= 0.9 ? 'Critical' : pct >= 0.75 ? 'Warning' : 'Healthy';
              const progressColor = pct >= 0.9 ? 'error' : pct >= 0.75 ? 'warning' : 'success';
              return (
                <TableRow
                  key={project.id}
                  hover
                  sx={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/admin/projects/${project.id}`)}
                >
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>{project.name}</Typography>
                    {project.isTeam && <Tag label="Team" size="small" color="warning" sx={{ mt: 0.5 }} />}
                  </TableCell>
                  <TableCell align="right">{project.memberIds.length}</TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" fontWeight={600}>{project.creditsUsed.toLocaleString()}</Typography>
                    <Typography variant="caption" color="text.secondary">/ {project.budget.toLocaleString()}</Typography>
                  </TableCell>
                  <TableCell>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(pct * 100, 100)}
                      color={progressColor}
                      sx={{ height: 6, borderRadius: 3, mb: 0.5 }}
                    />
                    <Typography variant="caption">{Math.round(pct * 100)}%</Typography>
                  </TableCell>
                  <TableCell>
                    <Tag
                      label={statusLabel}
                      color={progressColor}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              );
            })}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">No projects match your filters.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
}
