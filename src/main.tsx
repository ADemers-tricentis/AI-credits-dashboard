import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import ScopedCssBaseline from '@mui/material/ScopedCssBaseline';
import { theme } from './theme';
import { AppContextProvider } from './context/AppContext';
import App from './App';

// Force light color scheme - override OS preference and any cached localStorage value
localStorage.setItem('mui-mode', 'light');
document.documentElement.setAttribute('data-mui-color-scheme', 'light');
document.documentElement.style.colorScheme = 'light';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme} defaultMode="light">
      <ScopedCssBaseline>
        <AppContextProvider>
          <App />
        </AppContextProvider>
      </ScopedCssBaseline>
    </ThemeProvider>
  </StrictMode>
);
