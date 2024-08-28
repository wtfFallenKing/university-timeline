import {
  AppBar,
  Box,
  Dialog,
  DialogContent,
  IconButton,
  Link,
  Slide,
  Toolbar,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Link as RouterLink } from 'react-router-dom';
import SVGMap from './SVGMap';
import { useEffect, useState } from 'react';
import * as React from 'react';
import { TransitionProps } from '@mui/material/transitions';
import './map.css';
import { IBuilding } from '~/shared/types';
import Markdown from 'react-markdown';
import LazyImage from '../lazy-image';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type CMapProps = {
  buildings: Record<string, IBuilding>;
};

const CMap = ({ buildings }: CMapProps) => {
  const [building, setBuilding] = useState<IBuilding | null>(null);

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll('g'));
    const listeners = elements.map((element) => {
      const onClick = () => {
        if (buildings[element.id]) {
          setBuilding(buildings[element.id]);
        }
      };
      element.addEventListener('click', onClick);
      return onClick;
    });
    return () =>
      elements.forEach((element, i) => {
        element.removeEventListener('click', listeners[i]);
      });
  }, [buildings]);

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'baseline',
          gap: 5,
        }}
      >
        <Link component={RouterLink} to="/">
          Хронология
        </Link>
        <Typography variant="h2" textAlign={'center'}>
          Карта ПГНИУ
        </Typography>

        <Link component={RouterLink} to="/archive">
          Архив
        </Link>
      </Box>

      <SVGMap />
      {building !== null && (
        <Dialog
          open={building !== null}
          onClose={() => setBuilding(null)}
          TransitionComponent={Transition}
        >
          <AppBar sx={{ position: 'relative' }}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={() => setBuilding(null)}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
          <DialogContent>
            <Markdown>{building.text}</Markdown>
            <Box
              sx={{
                dislpay: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {building.medias.map((media) => (
                <LazyImage src={media} width="400" />
              ))}
            </Box>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default CMap;