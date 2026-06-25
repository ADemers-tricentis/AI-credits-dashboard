import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import MuiAlert from '@mui/material/Alert';
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined';
import WarningAmberOutlined from '@mui/icons-material/WarningAmberOutlined';
import BurnRateSVG from './BurnRateSVG';
import type { BurnRateWindow, DailyUsage } from '../types';
import { calcRenewalHealth } from '../data/mock';

type Props = {
  label: string;
  used: number;
  budget: number;
  renewalDate: string;
  dailyUsage: DailyUsage[];
  window: BurnRateWindow;
  onWindowChange: (w: BurnRateWindow) => void;
};

export default function BurnRateCard({ label, used, budget, renewalDate, dailyUsage, window, onWindowChange }: Props) {
  const health = calcRenewalHealth(used, budget, renewalDate, dailyUsage, window);
  const hasEnoughData = dailyUsage.length >= 7;

  return (
    <Card variant="outlined" sx={{ width: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, flexWrap: 'wrap', gap: 1 }}>
          <Box>
            <Typography variant="subtitle1" fontWeight={600}>{label} - Burn Rate Forecast</Typography>
            <Typography variant="body2" color="text.secondary">
              Renewal: {new Date(renewalDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </Typography>
          </Box>
          <ToggleButtonGroup
            value={window}
            exclusive
            size="small"
            onChange={(_, v: BurnRateWindow | null) => { if (v) onWindowChange(v); }}
            sx={{ '& .MuiToggleButton-root': { py: 0.5, px: 1.5, textTransform: 'none', fontSize: 12 } }}
          >
            <ToggleButton value="7d">7d</ToggleButton>
            <ToggleButton value="30d">30d</ToggleButton>
            <ToggleButton value="billing">Billing Period</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Primary: renewal health */}
        <Box sx={{ mb: 2 }}>
          {health.isAtRisk ? (
            <Chip
              icon={<WarningAmberOutlined />}
              label={`At risk - projected to exhaust ${health.monthsBeforeRenewal ?? 1} month${(health.monthsBeforeRenewal ?? 1) !== 1 ? 's' : ''} before renewal`}
              color="error"
              variant="outlined"
              sx={{ fontWeight: 600 }}
            />
          ) : (
            <Chip
              icon={<CheckCircleOutlined />}
              label="On track through renewal"
              color="success"
              variant="outlined"
              sx={{ fontWeight: 600 }}
            />
          )}
        </Box>

        {/* Learning period disclaimer */}
        {!hasEnoughData && (
          <MuiAlert severity="info" sx={{ mb: 2 }}>
            Forecast requires at least 7 days of usage data. Projection unavailable during the learning period.
          </MuiAlert>
        )}

        {/* Timeline SVG */}
        <BurnRateSVG
          used={used}
          budget={budget}
          renewalDate={renewalDate}
          estimatedExhaustionDate={health.estimatedExhaustionDate}
          isAtRisk={health.isAtRisk}
        />

        {/* Secondary: depletion estimate */}
        {hasEnoughData && health.daysRemaining !== undefined && (
          <Box sx={{ mt: 2, display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            <Box>
              <Typography variant="caption" color="text.secondary">Daily burn rate</Typography>
              <Typography variant="body2" fontWeight={500}>{health.dailyBurnRate} credits/day</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Est. depletion</Typography>
              <Typography variant="body2" fontWeight={500}>
                {health.estimatedExhaustionDate
                  ? new Date(health.estimatedExhaustionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                  : '-'}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Days of credits remaining</Typography>
              <Typography variant="body2" fontWeight={500}>{health.daysRemaining} days</Typography>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
