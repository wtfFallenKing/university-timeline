import { CssBaseline, ThemeProvider } from '@mui/material';
import { RouterProvider } from 'react-router-dom';
import { useAutoAnimate } from '@formkit/auto-animate/react';

import { router } from './router';

import { theme } from './theme';

export default function App() {
  const [parent] = useAutoAnimate();
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div ref={parent}>
        <RouterProvider router={router} />
      </div>
    </ThemeProvider>
  );
}