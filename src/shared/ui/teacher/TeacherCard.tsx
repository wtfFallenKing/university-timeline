import { Card, CardContent, CardMedia, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { translate } from '~/shared/links';

interface ITeacherCard {
  name: string;
  picture: string;
  link: string;
}

const TeacherCard = ({ name, picture, link }: ITeacherCard) => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardMedia sx={{ height: 200, backgroundSize: 'contain' }} image={picture} title={name} />
      <CardContent sx={{ textAlign: 'center' }}>
        <Link to={link} component={RouterLink}>
          {translate(name)}
        </Link>
      </CardContent>
    </Card>
  );
};

export default TeacherCard;