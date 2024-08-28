import { useLoaderData } from 'react-router-dom';
import { IDeanery } from '~/shared/types';
import Teacher from '~/shared/ui/teacher/Teacher';

export default function DeaneryPage() {
  const deanery = useLoaderData() as IDeanery;
  return <Teacher teacher={deanery} />;
}