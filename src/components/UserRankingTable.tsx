import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tag from '@tricentis/aura/components/Tag.js';
import ChipSubtle from '@tricentis/aura/components/ChipSubtle.js';
import { getProjectUserCredits } from '../data/mock';

type Props = {
  projectId: string;
  totalBudget: number;
  searchQuery?: string;
};

export default function UserRankingTable({ projectId, totalBudget, searchQuery }: Props) {
  const rows = getProjectUserCredits(projectId);
  const filtered = searchQuery
    ? rows.filter((r) => r.user.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : rows;

  const totalUsed = rows.reduce((s, r) => s + r.credits, 0);
  const avg = totalUsed / (rows.length || 1);

  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell sx={{ fontWeight: 600 }}>Rank</TableCell>
          <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
          <TableCell align="right" sx={{ fontWeight: 600 }}>Credits Used</TableCell>
          <TableCell align="right" sx={{ fontWeight: 600 }}>% of Budget</TableCell>
          <TableCell align="right" sx={{ fontWeight: 600 }}>vs. Project Avg</TableCell>
          <TableCell sx={{ fontWeight: 600 }}>Requests</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {filtered.map((row, i) => {
          const pctBudget = totalBudget > 0 ? (row.credits / totalBudget) * 100 : 0;
          const delta = avg > 0 ? ((row.credits - avg) / avg) * 100 : 0;
          const deltaLabel = delta >= 0 ? `+${Math.round(delta)}%` : `${Math.round(delta)}%`;
          const deltaColor = delta > 30 ? 'error' : delta > 0 ? 'warning' : 'success';

          return (
            <TableRow key={row.user.id} hover>
              <TableCell>
                <ChipSubtle label={String(i + 1)} size="small" />
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="body2" fontWeight={500}>{row.user.name}</Typography>
                  <Typography variant="caption" color="text.secondary">{row.user.email}</Typography>
                </Box>
              </TableCell>
              <TableCell align="right">
                <Typography variant="body2" fontWeight={600}>{row.credits.toLocaleString()}</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="body2">{pctBudget.toFixed(1)}%</Typography>
              </TableCell>
              <TableCell align="right">
                <Tag label={deltaLabel} color={deltaColor} size="small" />
              </TableCell>
              <TableCell>
                <Typography variant="body2">{row.requestCount}</Typography>
              </TableCell>
            </TableRow>
          );
        })}
        {filtered.length === 0 && (
          <TableRow>
            <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
              <Typography variant="body2" color="text.secondary">No members match your search.</Typography>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
