import { Typography } from '@mui/material';
import Markdown from 'react-markdown';
import { translate } from '~/shared/links';
import { IDepartment } from '~/shared/types';
import TeacherList from '../teacher/TeacherList';
import Layout from '../layout';

type DepartmentProps = {
  department: IDepartment;
};

const Department = ({ department }: DepartmentProps) => {
  return (
    <Layout>
      <Typography fontWeight="bold">{translate(department.name)}</Typography>
      <Markdown>{department.info}</Markdown>
      <Typography textAlign="center" variant="h4">
        Преподавательский состав:
      </Typography>
      <TeacherList teachers={department.teachers} />
    </Layout>
  );
};

export default Department;