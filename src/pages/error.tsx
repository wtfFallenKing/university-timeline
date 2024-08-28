import { Box, Link, Typography } from '@mui/material';
import { useRouteError, Link as RouterLink } from 'react-router-dom';

export default function ErrorPage() {
  const error = useRouteError() as Response;
  console.log(error);

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        minHeight: '100vh',
        textAlign: 'center',
        alignContent: 'center',
        alignItems: 'center',
      }}
    >
      <Typography variant="h3">
        {error ? error.data || error.message || 'Ошибка' : 'Неизвестная ошибка'}
      </Typography>
      <Link variant="h3" component={RouterLink} to="/archive">
        Архив
      </Link>
    </Box>
  );
}