import { useState } from 'react';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Fab from '@mui/material/Fab';
import Divider from '@mui/material/Divider';
import DrawerContainer from '@tricentis/aura/components/DrawerContainer.js';
import DrawerHeader from '@tricentis/aura/components/DrawerHeader.js';
import DrawerContent from '@tricentis/aura/components/DrawerContent.js';
import DrawerActions from '@tricentis/aura/components/DrawerActions.js';
import DrawerCloser from '@tricentis/aura/components/DrawerCloser.js';
import IconTricentisCopilot from '@tricentis/aura/components/IconTricentisCopilot.js';
import SendOutlined from '@mui/icons-material/SendOutlined';
import { useAppContext } from '../context/AppContext';
import { PRODUCTS, TENANT, calcRenewalHealth, DAILY_USAGE } from '../data/mock';

type Message = { role: 'user' | 'agent'; text: string };

function getResponse(query: string, role: string, currentUserId: string): string {
  const q = query.toLowerCase();

  const health = calcRenewalHealth(
    TENANT.products.reduce((s, p) => s + p.used, 0),
    TENANT.totalCredits,
    TENANT.renewalDate,
    Object.values(DAILY_USAGE).flat(),
    'billing'
  );

  if (q.includes('on track') || q.includes('renewal') || q.includes('health')) {
    return health.isAtRisk
      ? `Your tenant is **at risk** - currently projected to exhaust credits approximately ${health.monthsBeforeRenewal} month(s) before your renewal date of ${new Date(TENANT.renewalDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}. I recommend reviewing budget allocations in the Budget page.`
      : `You're **on track through renewal**. At the current pace (${health.dailyBurnRate} credits/day), your tenant should have sufficient credits through your ${new Date(TENANT.renewalDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })} renewal.`;
  }

  if (q.includes('days') || q.includes('remaining') || q.includes('runway') || q.includes('left')) {
    if (role === 'ic') {
      return `Based on current usage patterns, your project has approximately ${health.daysRemaining ?? 'N/A'} days of credits remaining at the current burn rate.`;
    }
    return `At the current burn rate of ${health.dailyBurnRate} credits/day, the tenant has approximately **${health.daysRemaining ?? 'N/A'} days** of credits remaining. Estimated depletion: ${health.estimatedExhaustionDate ? new Date(health.estimatedExhaustionDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}.`;
  }

  if (q.includes('credits used') || q.includes('how much') || q.includes('usage')) {
    if (role === 'ic') {
      return `I can see your usage data is attributed to your assigned projects. Check the "My Credits by Product & Project" table on your dashboard for a full breakdown.`;
    }
    if (role === 'lead') {
      return `Your project's current usage is visible in the project detail view. Use the date range filter to adjust the reporting period.`;
    }
    const total = PRODUCTS.reduce((s, p) => s + p.used, 0);
    return `This billing period, the tenant has consumed **${total.toLocaleString()} credits** across all products. Top consumers: Tosca (5,520), AI Workspace (4,350), qTest (3,800), NeoLoad (1,680).`;
  }

  if (q.includes('top') || q.includes('who') || q.includes('consumer') || q.includes('project')) {
    if (role === 'ic') {
      return `As an individual contributor, I can only show your own usage. Your admin or project lead can see project-level rankings.`;
    }
    return `The top projects by credit consumption are: **AI Copilot POC** (2,100), **ERP Automation** (2,100), **SAP Regression** (1,980), and **Falcon Web App** (1,640). Click any project in the leaderboard to drill into per-user details.`;
  }

  if (q.includes('budget') || q.includes('allocat') || q.includes('reallocat')) {
    if (role !== 'admin') {
      return `Budget management is available to tenant admins only. Contact your admin to request a credit reallocation.`;
    }
    const reserve = TENANT.totalCredits - PRODUCTS.reduce((s, p) => s + p.budget, 0);
    return `The tenant has ${TENANT.totalCredits.toLocaleString()} contracted credits. Currently allocated: ${(TENANT.totalCredits - reserve).toLocaleString()}. Reserve: ${reserve.toLocaleString()}. You can reallocate credits between products on the Budget page.`;
  }

  if (q.includes('alert') || q.includes('threshold') || q.includes('warning')) {
    return `There are currently 2 unread alerts: Tosca has reached 92% of budget, and the AI Copilot POC project has exceeded its project budget. Alert thresholds can be configured per-product on the Budget page.`;
  }

  const suggestions = role === 'admin'
    ? '"credits used this period", "am I on track for renewal?", "days remaining", "who is my top consumer", "budget overview"'
    : role === 'lead'
      ? '"credits used this period", "days remaining", "am I on track for renewal?"'
      : '"how many credits have I used?", "how many days remaining?", "am I on track for renewal?"';

  return `I can help you with AI credit questions scoped to your ${role} role. Try asking: ${suggestions}.`;
}

export default function ChatAgentPanel() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'agent', text: 'Hi! I\'m your AI Credit Assistant. Ask me about credit usage, burn rate, renewal health, or budget allocation.' },
  ]);
  const { role, currentUserId } = useAppContext();

  function handleSend() {
    if (!input.trim()) return;
    const userMsg: Message = { role: 'user', text: input.trim() };
    const agentMsg: Message = { role: 'agent', text: getResponse(input.trim(), role, currentUserId) };
    setMessages((prev) => [...prev, userMsg, agentMsg]);
    setInput('');
  }

  return (
    <>
      <Fab
        color="primary"
        sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1200 }}
        onClick={() => setOpen(true)}
        aria-label="Open AI Credit Assistant"
      >
        <IconTricentisCopilot />
      </Fab>

      <Drawer anchor="right" open={open} onClose={() => setOpen(false)} sx={{ zIndex: 1300 }}>
        <DrawerContainer sx={{ width: 400 }}>
          <DrawerHeader heading="AI Credit Assistant">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconTricentisCopilot sx={{ color: 'primary.main' }} />
            </Box>
            <DrawerCloser onClose={() => setOpen(false)} />
          </DrawerHeader>
          <Divider />
          <DrawerContent sx={{ display: 'flex', flexDirection: 'column', gap: 1, overflowY: 'auto' }}>
            {messages.map((msg, i) => (
              <Box
                key={i}
                sx={{
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  bgcolor: msg.role === 'user' ? 'primary.main' : 'action.hover',
                  color: msg.role === 'user' ? 'primary.contrastText' : 'text.primary',
                  borderRadius: 2,
                  px: 1.5,
                  py: 1,
                }}
              >
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{msg.text}</Typography>
              </Box>
            ))}
          </DrawerContent>
          <Divider />
          <DrawerActions>
            <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Ask about credits, burn rate, renewal..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                multiline
                maxRows={3}
              />
              <IconButton color="primary" onClick={handleSend} disabled={!input.trim()}>
                <SendOutlined />
              </IconButton>
            </Box>
          </DrawerActions>
        </DrawerContainer>
      </Drawer>
    </>
  );
}
