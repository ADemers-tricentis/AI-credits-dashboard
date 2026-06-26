import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider, useColorScheme } from '@mui/material/styles';
import ScopedCssBaseline from '@mui/material/ScopedCssBaseline';
import { theme } from './theme';
import { AppContextProvider } from './context/AppContext';
import App from './App';

localStorage.setItem('mui-mode', 'light');

function ForceLightMode({ children }: { children: React.ReactNode }) {
  const { setColorScheme } = useColorScheme();
  useEffect(() => {
    setColorScheme('light');
  }, [setColorScheme]);
  return <>{children}</>;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme} defaultMode="light">
      <ForceLightMode>
        <ScopedCssBaseline>
          <AppContextProvider>
            <App />
          </AppContextProvider>
        </ScopedCssBaseline>
      </ForceLightMode>
    </ThemeProvider>
  </StrictMode>
);
