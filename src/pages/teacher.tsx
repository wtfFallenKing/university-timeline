import { useLoaderData } from 'react-router-dom';
import { ITeacher } from '~/shared/types';
import Teacher from '~/shared/ui/teacher/Teacher';

const TeacherPage = () => {
  const teacher = useLoaderData() as ITeacher;
  return <Teacher teacher={teacher} />;
};

export default TeacherPage;