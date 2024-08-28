import { useLoaderData } from 'react-router-dom';
import { IDepartment } from '~/shared/types';
import Department from '~/shared/ui/department/Department';

const DepartmentPage = () => {
  const department = useLoaderData() as IDepartment;

  return <Department department={department} />;
};

export default DepartmentPage;