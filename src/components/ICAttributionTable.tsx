import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableFooter from '@mui/material/TableFooter';
import Typography from '@mui/material/Typography';
import Tag from '@tricentis/aura/components/Tag.js';
import { PROJECTS, PRODUCTS, CREDIT_EVENTS } from '../data/mock';
import { useAppContext } from '../context/AppContext';

const PRODUCT_COLORS: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
  qtest: 'primary',
  neoload: 'info',
  tosca: 'secondary',
  aiworkspace: 'warning',
};

export default function ICAttributionTable() {
  const { currentUserId } = useAppContext();

  const myEvents = CREDIT_EVENTS.filter((e) => e.userId === currentUserId);

  const rows = PROJECTS
    .filter((p) => p.memberIds.includes(currentUserId))
    .map((project) => {
      const product = PRODUCTS.find((p) => p.id === project.productId)!;
      const events = myEvents.filter((e) => e.projectId === project.id);
      const credits = events.reduce((s, e) => s + e.credits, 0);
      const requestCount = events.length;
      const pctBudget = project.budget > 0 ? (credits / project.budget) * 100 : 0;
      return { project, product, credits, requestCount, pctBudget };
    })
    .filter((r) => r.credits > 0);

  const totalCredits = rows.reduce((s, r) => s + r.credits, 0);
  const totalRequests = rows.reduce((s, r) => s + r.requestCount, 0);

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell sx={{ fontWeight: 600 }}>Product</TableCell>
          <TableCell sx={{ fontWeight: 600 }}>Project</TableCell>
          <TableCell align="right" sx={{ fontWeight: 600 }}>Credits Used</TableCell>
          <TableCell align="right" sx={{ fontWeight: 600 }}>Requests</TableCell>
          <TableCell align="right" sx={{ fontWeight: 600 }}>% of Project Budget</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.project.id} hover>
            <TableCell>
              <Tag label={row.product.name} color={PRODUCT_COLORS[row.product.id]} size="small" />
            </TableCell>
            <TableCell>
              <Typography variant="body2">{row.project.name}</Typography>
            </TableCell>
            <TableCell align="right">
              <Typography variant="body2" fontWeight={600}>{row.credits.toLocaleString()}</Typography>
            </TableCell>
            <TableCell align="right">
              <Typography variant="body2">{row.requestCount}</Typography>
            </TableCell>
            <TableCell align="right">
              <Typography variant="body2">{row.pctBudget.toFixed(1)}%</Typography>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={2} sx={{ fontWeight: 700 }}>Total</TableCell>
          <TableCell align="right" sx={{ fontWeight: 700 }}>{totalCredits.toLocaleString()}</TableCell>
          <TableCell align="right" sx={{ fontWeight: 700 }}>{totalRequests}</TableCell>
          <TableCell />
        </TableRow>
      </TableFooter>
    </Table>
  );
}
