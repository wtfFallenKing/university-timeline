import { Box, CircularProgress } from '@mui/material';
import React, { useEffect, useState } from 'react';

interface LazyImageProps
  extends React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {}

function LazyImage(props: LazyImageProps) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const image = new Image();
    image.src = props.src!;
    const onLoad = () => setLoaded(true);
    image.addEventListener('load', onLoad);
    return () => image.removeEventListener('load', onLoad);
  }, [props]);

  if (!loaded) {
    return (
      <Box sx={props.style}>
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  return <img {...props} />;
}

export default LazyImage;
