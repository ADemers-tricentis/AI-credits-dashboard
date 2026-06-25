import { useState } from 'react';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import DrawerContainer from '@tricentis/aura/components/DrawerContainer.js';
import DrawerHeader from '@tricentis/aura/components/DrawerHeader.js';
import DrawerContent from '@tricentis/aura/components/DrawerContent.js';
import DrawerActions from '@tricentis/aura/components/DrawerActions.js';
import DrawerCloser from '@tricentis/aura/components/DrawerCloser.js';
import NumberField from '@tricentis/aura/components/NumberField.js';
import { PRODUCTS, TENANT } from '../data/mock';
import type { ProductId } from '../types';

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function BudgetAllocationDrawer({ open, onClose }: Props) {
  const [budgets, setBudgets] = useState<Record<ProductId, number>>(
    Object.fromEntries(PRODUCTS.map((p) => [p.id, p.budget])) as Record<ProductId, number>
  );
  const [fromProduct, setFromProduct] = useState<ProductId>('neoload');
  const [toProduct, setToProduct] = useState<ProductId>('aiworkspace');
  const [transferAmount, setTransferAmount] = useState(500);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const totalAllocated = Object.values(budgets).reduce((s, v) => s + v, 0);
  const reserve = TENANT.totalCredits - totalAllocated;

  function handleSave() {
    if (totalAllocated > TENANT.totalCredits) {
      setError('Total allocation exceeds tenant contract. Please reduce one or more product budgets.');
      return;
    }
    setError('');
    setSuccess(true);
    onClose();
  }

  function handleTransfer() {
    const fromBudget = budgets[fromProduct];
    const fromUsed = PRODUCTS.find((p) => p.id === fromProduct)!.used;
    if (transferAmount > fromBudget - fromUsed) {
      setError('Cannot transfer credits below current usage for the source product.');
      return;
    }
    if (fromProduct === toProduct) {
      setError('Source and destination products must be different.');
      return;
    }
    setBudgets((prev) => ({
      ...prev,
      [fromProduct]: prev[fromProduct] - transferAmount,
      [toProduct]: prev[toProduct] + transferAmount,
    }));
    setError('');
  }

  return (
    <>
      <Drawer anchor="right" open={open} onClose={onClose}>
        <DrawerContainer sx={{ width: 440 }}>
          <DrawerHeader heading="Budget Allocation">
            <DrawerCloser onClose={onClose} />
          </DrawerHeader>
          <Divider />
          <DrawerContent sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Tenant total: <strong>{TENANT.totalCredits.toLocaleString()} credits</strong> |
                Allocated: <strong>{totalAllocated.toLocaleString()}</strong> |
                Reserve: <strong>{reserve.toLocaleString()}</strong>
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="subtitle2" fontWeight={600}>Per-Product Allocations</Typography>
              {PRODUCTS.map((product) => (
                <Box key={product.id} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body2" sx={{ minWidth: 130 }}>{product.name}</Typography>
                  <NumberField
                    value={budgets[product.id]}
                    min={product.used}
                    max={TENANT.totalCredits}
                    step={100}
                    onValueChange={(v) => setBudgets((prev) => ({ ...prev, [product.id]: v ?? product.used }))}
                    size="small"
                    sx={{ width: 140 }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    (used: {product.used.toLocaleString()})
                  </Typography>
                </Box>
              ))}
            </Box>

            <Divider />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="subtitle2" fontWeight={600}>Reallocate Between Products</Typography>
              <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
                <FormControl size="small" sx={{ minWidth: 130 }}>
                  <InputLabel>From</InputLabel>
                  <Select value={fromProduct} label="From" onChange={(e) => setFromProduct(e.target.value as ProductId)}>
                    {PRODUCTS.map((p) => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
                  </Select>
                </FormControl>
                <Typography variant="body2">→</Typography>
                <FormControl size="small" sx={{ minWidth: 130 }}>
                  <InputLabel>To</InputLabel>
                  <Select value={toProduct} label="To" onChange={(e) => setToProduct(e.target.value as ProductId)}>
                    {PRODUCTS.map((p) => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
                  </Select>
                </FormControl>
                <NumberField
                  value={transferAmount}
                  min={1}
                  max={10000}
                  step={100}
                  onValueChange={(v) => setTransferAmount(v ?? 100)}
                  size="small"
                  sx={{ width: 120 }}
                />
                <Button variant="outlined" size="small" onClick={handleTransfer}>Transfer</Button>
              </Box>
            </Box>

            {error && <MuiAlert severity="error">{error}</MuiAlert>}
          </DrawerContent>
          <Divider />
          <DrawerActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button variant="contained" onClick={handleSave}>Save Allocations</Button>
          </DrawerActions>
        </DrawerContainer>
      </Drawer>

      <Snackbar open={success} autoHideDuration={4000} onClose={() => setSuccess(false)}>
        <MuiAlert severity="success" onClose={() => setSuccess(false)}>
          Budget allocations saved successfully.
        </MuiAlert>
      </Snackbar>
    </>
  );
}
