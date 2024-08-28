import { useMediaQuery } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useParams } from 'react-router-dom';
import DepartmentCard from './DepartmentCard';
import { IDepartment } from '~/shared/types';

type DepartmentListProps = {
  departments: IDepartment[];
};

const DepartmentList = ({ departments }: DepartmentListProps) => {
  const isDesktop = useMediaQuery('(min-width:769px)');
  const { faculty } = useParams();
  return (
    <Grid container mx={isDesktop ? '10%' : ''} spacing={1}>
      {departments.map((department) => {
        return (
          <Grid xs={isDesktop ? 4 : 12} key={faculty + '/' + department}>
            <DepartmentCard
              key={faculty + '.' + department}
              name={department.name}
              faculty={faculty!}
            />
          </Grid>
        );
      })}
    </Grid>
  );
};

export default DepartmentList;