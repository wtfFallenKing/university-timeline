import { useMediaQuery } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

import { useParams } from 'react-router-dom';
import TeacherCard from './TeacherCard';
import { ITeacher } from '~/shared/types';
import { deaneryUrl, teacherUrl } from '~/shared/links';

type TeacherListProps = {
  teachers: ITeacher[];
};

const TeacherList = ({ teachers }: TeacherListProps) => {
  const isDesktop = useMediaQuery('(min-width:769px)');
  const { faculty, department } = useParams();
  return (
    <Grid container spacing={1} sx={{ m: 5 }}>
      {teachers.map((teacher) => {
        return (
          <Grid xs={isDesktop ? 4 : 12} key={faculty + '/' + teacher.name}>
            <TeacherCard
              key={faculty + '.' + teacher.name}
              name={teacher.name}
              picture={teacher.logo}
              link={
                department
                  ? teacherUrl(faculty, department, teacher.name)
                  : deaneryUrl(faculty, teacher.name)
              }
            />
          </Grid>
        );
      })}
    </Grid>
  );
};

export default TeacherList;