import { Card, CardContent, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { translate } from '~/shared/links';

interface DepartmentCardProps {
  name: string;
  faculty: string;
}

const DepartmentCard = ({ name, faculty }: DepartmentCardProps) => {
  console.log([name, translate(name)]);
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ textAlign: 'center', padding: 5 }}>
        <Link
          component={RouterLink}
          to={'/archive/' + faculty + '/departments/' + name}
          textAlign="center"
          sx={{
            wordWrap: 'break-word',
          }}
        >
          {translate(name)}
        </Link>
      </CardContent>
    </Card>
  );
};

export default DepartmentCard;