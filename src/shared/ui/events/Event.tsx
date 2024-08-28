import { Box, Divider, Paper, Typography, useMediaQuery, Link } from '@mui/material';
import Markdown from 'react-markdown';
import { Link as RouterLink } from 'react-router-dom';
import LazyImage from '~/shared/ui/lazy-image';

interface IEvent {
  name: string;
  text: string;
  objects: { year: string; name: string }[];
  media: string[];
}

const isImage = (file: string) => {
  const extension = file.split('.').pop();
  if (extension === 'png' || extension === 'jpg' || extension === 'jpeg' || extension === 'svg') {
    return true;
  }
  return false;
};

const Event = ({ name, text, objects, media }: IEvent) => {
  const isDesktop = useMediaQuery('(min-width:769px)');
  return (
    <Box
      sx={{
        minHeight: '100vh',
        height: '100%',
      }}
    >
      <Typography variant="h4" sx={{ textAlign: 'center', flex: '1' }}>
        {name}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          m: 5,
          gap: 1,
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          flexDirection: isDesktop ? 'row' : 'column',
        }}
      >
        <Paper
          sx={{
            p: 3,
            minHeight: '80vh',
            height: 'auto',
            alignSelf: 'stretch',
            flex: isDesktop ? '1' : 'unset',
          }}
        >
          <Markdown>{text}</Markdown>
        </Paper>
        {media.length > 0 && (
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              maxWidth: isDesktop ? '30vw' : '100%',
              gap: 1,
            }}
          >
            {media.map((mediaElement: string) => {
              return (
                <>
                  {isImage(mediaElement) ? (
                    <LazyImage
                      src={mediaElement}
                      alt={mediaElement}
                      key={mediaElement}
                      style={{
                        objectFit: 'contain',
                        height: `${parseInt((100 / media.length).toFixed()) - 20}vh`,
                        width: isDesktop ? '25vw' : '100%',
                        border: '1px solid #000',
                        borderRadius: '10px',
                      }}
                    />
                  ) : null}
                </>
              );
            })}
          </Paper>
        )}
        <Paper
          sx={{
            maxWidth: isDesktop ? '25%' : '100%',
            height: 'auto',
            py: 5,
            px: 2,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-around',
            }}
          >
            <Link to="/archive" component={RouterLink}>
              Архив
            </Link>
            <Link to="/map" component={RouterLink}>
              Карта
            </Link>
          </Box>
          <ul
            style={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              justifyContent: 'space-evenly',
            }}
          >
            {objects.map((element, index) => (
              <>
                <li key={element.year + element.name}>
                  <Box>
                    <Typography variant="body1" fontWeight="bold">
                      {element.name}
                    </Typography>
                    <Typography
                      sx={{
                        alignSelf: 'center',
                      }}
                    >
                      {element.year} год
                    </Typography>
                  </Box>
                </li>
                {index !== objects.length - 1 && <Divider />}
              </>
            ))}
          </ul>
        </Paper>
      </Box>
    </Box>
  );
};

export default Event;