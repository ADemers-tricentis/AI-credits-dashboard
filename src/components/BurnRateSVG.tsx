import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

type Props = {
  used: number;
  budget: number;
  renewalDate: string;
  estimatedExhaustionDate?: string;
  isAtRisk: boolean;
};

export default function BurnRateSVG({ used, budget, renewalDate, estimatedExhaustionDate, isAtRisk }: Props) {
  const theme = useTheme();
  const now = new Date();
  const renewal = new Date(renewalDate);

  const contractStart = new Date(renewal);
  contractStart.setFullYear(contractStart.getFullYear() - 1);

  const totalMs = renewal.getTime() - contractStart.getTime();
  const elapsedMs = now.getTime() - contractStart.getTime();
  const todayPct = Math.min(Math.max(elapsedMs / totalMs, 0), 1);
  const usedPct = Math.min(used / budget, 1);

  let exhaustionPct: number | null = null;
  if (estimatedExhaustionDate) {
    const exhaustion = new Date(estimatedExhaustionDate);
    const exhaustionMs = exhaustion.getTime() - contractStart.getTime();
    exhaustionPct = Math.min(Math.max(exhaustionMs / totalMs, 0), 1.05);
  }

  const barH = 20;
  const svgH = 60;
  const barY = 12;

  const healthColor = isAtRisk ? theme.palette.error.main : theme.palette.success.main;
  const usedColor = isAtRisk ? theme.palette.error.light : theme.palette.success.light;

  return (
    <Box sx={{ width: '100%', userSelect: 'none' }}>
      <svg width="100%" height={svgH} style={{ overflow: 'visible' }}>
        {/* Background track */}
        <rect x="0" y={barY} width="100%" height={barH} rx={4} fill={theme.palette.action.hover} />
        {/* Used fill */}
        <rect x="0" y={barY} width={`${usedPct * 100}%`} height={barH} rx={4} fill={usedColor} />
        {/* Today marker */}
        <line
          x1={`${todayPct * 100}%`} y1={barY - 4}
          x2={`${todayPct * 100}%`} y2={barY + barH + 4}
          stroke={theme.palette.text.primary}
          strokeWidth={2}
          strokeDasharray="3,2"
        />
        {/* Exhaustion marker */}
        {exhaustionPct !== null && exhaustionPct <= 1.02 && (
          <line
            x1={`${exhaustionPct * 100}%`} y1={barY - 4}
            x2={`${exhaustionPct * 100}%`} y2={barY + barH + 4}
            stroke={healthColor}
            strokeWidth={2}
            strokeDasharray="4,3"
          />
        )}
        {/* Renewal marker */}
        <line
          x1="100%" y1={barY - 4}
          x2="100%" y2={barY + barH + 4}
          stroke={theme.palette.text.secondary}
          strokeWidth={1.5}
        />
        {/* Labels */}
        {(() => {
          const tooClose = exhaustionPct !== null && exhaustionPct <= 1.02 && Math.abs(exhaustionPct - todayPct) < 0.1;
          return (
            <>
              <text
                x={`${todayPct * 100}%`}
                y={tooClose ? svgH - 13 : svgH}
                textAnchor="middle"
                fontSize={11}
                fill={theme.palette.text.secondary}
              >
                Today
              </text>
              {exhaustionPct !== null && exhaustionPct <= 1.02 && (
                <text
                  x={`${Math.min(exhaustionPct * 100, 95)}%`}
                  y={svgH}
                  textAnchor="middle"
                  fontSize={11}
                  fill={healthColor}
                >
                  Est. end
                </text>
              )}
            </>
          );
        })()}
        <text x="100%" y={svgH} textAnchor="end" fontSize={11} fill={theme.palette.text.secondary}>
          Renewal
        </text>
      </svg>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
        <Typography variant="caption" color="text.secondary">
          {used.toLocaleString()} / {budget.toLocaleString()} credits used
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {(budget - used).toLocaleString()} remaining
        </Typography>
      </Box>
    </Box>
  );
}
