import { useLoaderData } from 'react-router-dom';
import { IFaculty } from '~/shared/types';
import Faculty from '~/shared/ui/faculty/Faculty';

const FacultyPage = () => {
  const faculty = useLoaderData() as IFaculty;
  return <Faculty faculty={faculty} />;
};

export default FacultyPage;