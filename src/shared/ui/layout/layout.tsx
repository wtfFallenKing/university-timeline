import { Box, CircularProgress } from '@mui/material';
import { ReactNode } from 'react';
import ArchiveBreadcrumbs from './archive-breadcrumbs';
import { useNavigation } from 'react-router-dom';

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const { state } = useNavigation();
  return (
    <Box
      sx={{
        mx: '5%',
      }}
    >
      <ArchiveBreadcrumbs />
      {state === 'loading' ? (
        <Box
          sx={{
            minHeight: '100vh',
            height: '100%',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <>{children}</>
      )}
    </Box>
  );
}