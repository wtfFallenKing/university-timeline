import {Box, Typography, useMediaQuery} from '@mui/material';
import Markdown from 'react-markdown';

import DepartmentList from '../department/DepartmentList';
import TeacherList from '../teacher/TeacherList';
import Layout from '~/shared/ui/layout';
import {IFaculty} from '~/shared/types';
import {translate} from '~/shared/links';
import LazyImage from '../lazy-image';

type FacultyProps = {
  faculty: IFaculty;
};

const Faculty = ({faculty}: FacultyProps) => {
  const isDesktop = useMediaQuery('(min-width:769px)');
  return (
    <Layout>
      <Box>
        <Typography fontWeight={500} paddingBottom={3}>
          {translate(faculty.name)}
        </Typography>
        <Box>
          <LazyImage src={faculty.logo} alt="Фотография факультета"/>
          <Markdown>{faculty.info}</Markdown>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: isDesktop ? 'row' : 'column',
        }}
      >
        {faculty.departments.length > 0 && (
          <Box>
            <Typography textAlign="center">Кафедры факультета:</Typography>
            <DepartmentList departments={faculty.departments}/>
          </Box>
        )}

        {faculty.deanery.length > 0 && (
          <Box>
            <Typography textAlign="center">Деканат:</Typography>
            <TeacherList teachers={faculty.deanery}/>
          </Box>
        )}
      </Box>
    </Layout>
  );
};

export default Faculty;