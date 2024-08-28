import { Card, CardContent, CardMedia, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { translate } from '~/shared/links';

interface IFacultyCard {
  logo: string;
  name: string;
}

const FacultyCard = ({ logo, name }: IFacultyCard) => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardMedia sx={{ height: 200, backgroundSize: 'contain' }} image={logo} title={name} />
      <CardContent sx={{ textAlign: 'center', padding: 1 }}>
        <Link
          to={`/archive/${name}`}
          component={RouterLink}
          sx={{
            wordBreak: 'break-word',
          }}
        >
          {translate(name)}
        </Link>
      </CardContent>
    </Card>
  );
};

export default FacultyCard;