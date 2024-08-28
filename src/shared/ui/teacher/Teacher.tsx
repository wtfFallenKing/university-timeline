import { Typography } from '@mui/material';
import Markdown from 'react-markdown';
import { translate } from '~/shared/links';
import { ITeacher } from '~/shared/types';
import Layout from '../layout';
import LazyImage from '../lazy-image';

type TeacherProps = {
  teacher: ITeacher;
};

const Teacher = ({ teacher }: TeacherProps) => {
  return (
    <Layout>
      <Typography fontWeight="bold">{translate(teacher.name)}</Typography>
      <LazyImage src={teacher.logo} />
      <Markdown>{teacher.info}</Markdown>
    </Layout>
  );
};

export default Teacher;