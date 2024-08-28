import { Breadcrumbs, Link } from '@mui/material';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { translate, facultyUrl, departmentUrl, deaneryUrl, teacherUrl } from '~/shared/links';

export default function ArchiveBreadcrumbs() {
  const { faculty, department, deanery, teacher } = useParams();

  return (
    <Breadcrumbs
      sx={{
        my: 3,
        fontWeight: 600,
      }}
    >
      <Link component={RouterLink} to="/archive" underline="hover">
        Архив
      </Link>
      {[faculty, department, teacher, deanery]
        .filter((part) => part)
        .map((part) => (
          <Link
            component={RouterLink}
            to={
              {
                [faculty || '']: facultyUrl(faculty),
                [department || '']: departmentUrl(faculty, department),
                [deanery || '']: deaneryUrl(faculty, deanery),
                [teacher || '']: teacherUrl(faculty, department, teacher),
              }[part]
            }
            underline="hover"
          >
            {translate(part)}
          </Link>
        ))}
    </Breadcrumbs>
  );
}