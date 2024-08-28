import { useLoaderData } from 'react-router-dom';
import { Box, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import FacultyList from '~/shared/ui/faculty/FacultyList';
import type { IFaculty } from '~/shared/types';

const ArchivePage = () => {
  const faculties = useLoaderData() as IFaculty[];
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          my: 2,
        }}
      >
        <Link component={RouterLink} to="/" variant="h3">
          Хронология
        </Link>
      </Box>
      <FacultyList faculties={faculties} />
    </>
  );
};

export default ArchivePage;