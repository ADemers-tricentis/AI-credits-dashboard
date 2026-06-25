import { useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import LinearProgress from '@mui/material/LinearProgress';
import Button from '@mui/material/Button';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Tag from '@tricentis/aura/components/Tag.js';
import NumberField from '@tricentis/aura/components/NumberField.js';
import { PRODUCTS, TENANT } from '../../data/mock';
import type { ProductId } from '../../types';

const PRODUCT_COLORS: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
  qtest: 'primary',
  neoload: 'info',
  tosca: 'secondary',
  aiworkspace: 'warning',
};

export default function AdminBudgetPage() {
  const [budgets, setBudgets] = useState<Record<ProductId, number>>(
    Object.fromEntries(PRODUCTS.map((p) => [p.id, p.budget])) as Record<ProductId, number>
  );
  const [fromProduct, setFromProduct] = useState<ProductId>('neoload');
  const [toProduct, setToProduct] = useState<ProductId>('aiworkspace');
  const [transferAmount, setTransferAmount] = useState(500);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [alertThresholds, setAlertThresholds] = useState<Record<ProductId, number>>(
    Object.fromEntries(PRODUCTS.map((p) => [p.id, Math.round(p.alertThreshold * 100)])) as Record<ProductId, number>
  );

  const totalAllocated = Object.values(budgets).reduce((s, v) => s + v, 0);
  const reserve = TENANT.totalCredits - totalAllocated;

  function handleTransfer() {
    if (fromProduct === toProduct) { setError('Source and destination must differ.'); return; }
    const fromUsed = PRODUCTS.find((p) => p.id === fromProduct)!.used;
    if (transferAmount > budgets[fromProduct] - fromUsed) {
      setError('Transfer amount exceeds available headroom in source product.'); return;
    }
    setBudgets((prev) => ({
      ...prev,
      [fromProduct]: prev[fromProduct] - transferAmount,
      [toProduct]: prev[toProduct] + transferAmount,
    }));
    setError('');
  }

  function handleSave() {
    if (totalAllocated > TENANT.totalCredits) {
      setError('Total allocation exceeds tenant contract.');
      return;
    }
    setError('');
    setSuccess(true);
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Typography variant="h5" fontWeight={700}>Budget Management</Typography>
        <Typography variant="body2" color="text.secondary">{TENANT.name}</Typography>
      </Box>

      {/* Tenant summary */}
      <Card variant="outlined">
        <CardContent>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Typography variant="caption" color="text.secondary">Total Contracted</Typography>
              <Typography variant="h5" fontWeight={700}>{TENANT.totalCredits.toLocaleString()}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Typography variant="caption" color="text.secondary">Total Allocated</Typography>
              <Typography variant="h5" fontWeight={700} color={totalAllocated > TENANT.totalCredits ? 'error' : 'text.primary'}>
                {totalAllocated.toLocaleString()}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Typography variant="caption" color="text.secondary">Reserve (Unallocated)</Typography>
              <Typography variant="h5" fontWeight={700} color={reserve < 0 ? 'error' : 'success.main'}>
                {reserve.toLocaleString()}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Per-product allocation */}
      <Box>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>Per-Product Allocations</Typography>
        <Grid container spacing={2}>
          {PRODUCTS.map((product) => {
            const budget = budgets[product.id];
            const pct = product.used / budget;
            const progressColor = pct >= 0.9 ? 'error' : pct >= 0.75 ? 'warning' : 'success';
            return (
              <Grid key={product.id} size={{ xs: 12, sm: 6 }}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="subtitle2" fontWeight={600}>{product.name}</Typography>
                      <Tag label={`${Math.round(pct * 100)}% used`} color={progressColor} size="small" />
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(pct * 100, 100)}
                      color={progressColor}
                      sx={{ height: 6, borderRadius: 3, mb: 1.5 }}
                    />
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary" display="block">Budget</Typography>
                        <NumberField
                          value={budget}
                          min={product.used}
                          max={TENANT.totalCredits}
                          step={100}
                          onValueChange={(v) => setBudgets((prev) => ({ ...prev, [product.id]: v ?? product.used }))}
                          size="small"
                          sx={{ width: 140 }}
                        />
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary" display="block">Alert threshold (%)</Typography>
                        <NumberField
                          value={alertThresholds[product.id]}
                          min={50}
                          max={100}
                          step={5}
                          onValueChange={(v) => setAlertThresholds((prev) => ({ ...prev, [product.id]: v ?? 80 }))}
                          size="small"
                          sx={{ width: 100 }}
                        />
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary" display="block">Used</Typography>
                        <Typography variant="body2" fontWeight={500}>{product.used.toLocaleString()}</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>

      {/* Reallocation */}
      <Card variant="outlined">
        <CardContent>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>Reallocate Between Products</Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel>From</InputLabel>
              <Select value={fromProduct} label="From" onChange={(e) => setFromProduct(e.target.value as ProductId)}>
                {PRODUCTS.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.name} ({(budgets[p.id] - p.used).toLocaleString()} avail.)
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Typography variant="body1" sx={{ mb: 1 }}>→</Typography>
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel>To</InputLabel>
              <Select value={toProduct} label="To" onChange={(e) => setToProduct(e.target.value as ProductId)}>
                {PRODUCTS.map((p) => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
              </Select>
            </FormControl>
            <Box>
              <Typography variant="caption" color="text.secondary" display="block">Amount</Typography>
              <NumberField
                value={transferAmount}
                min={1}
                max={10000}
                step={100}
                onValueChange={(v) => setTransferAmount(v ?? 100)}
                size="small"
                sx={{ width: 140 }}
              />
            </Box>
            <Button variant="outlined" onClick={handleTransfer}>Transfer</Button>
          </Box>
        </CardContent>
      </Card>

      {error && <MuiAlert severity="error">{error}</MuiAlert>}

      <Box>
        <Button variant="contained" size="large" onClick={handleSave}>Save All Allocations</Button>
      </Box>

      <Snackbar open={success} autoHideDuration={4000} onClose={() => setSuccess(false)}>
        <MuiAlert severity="success" onClose={() => setSuccess(false)}>
          Budget allocations saved.
        </MuiAlert>
      </Snackbar>
    </Box>
  );
}
