import { Box, Button } from '@mui/material';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import Event from './Event';
import { IEvent } from '~/shared/types';
import { translate } from '~/shared/links';
import { useMemo, useState } from 'react';

import background from '~/shared/assets/timeline-bg.jpg';

import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

type EventListProps = {
  events: IEvent[];
};

const EventList = ({ events }: EventListProps) => {
  const [eventIndex, setEventIndex] = useState<number>(0);
  const eventList = useMemo(
    () =>
      events.sort(({ name: a }, { name: b }) => {
        if (a < b) {
          return -1;
        } else if (a === b) {
          return 0;
        } else {
          return 1;
        }
      }),
    [events],
  );
  const event = useMemo(() => eventList[eventIndex], [eventList, eventIndex]);

  const [parent] = useAutoAnimate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        height: '100%',

        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8) ), url(${background})`,
        backgroundSize: '100vw 100vh',
      }}
    >
      <Box
        sx={{
          position: 'fixed',
          display: 'flex',
          width: '100%',
          top: '50%',
          justifyContent: 'space-between',
          zIndex: 1,
        }}
      >
        <Button
          variant="contained"
          sx={{
            minWidth: '0px',
            padding: '2em 0.5em',
            opacity: '0.8',
          }}
          disabled={eventIndex === 0}
          onClick={() => setEventIndex((index) => index - 1)}
        >
          <NavigateBeforeIcon />
        </Button>
        <Button
          variant="contained"
          sx={{
            minWidth: '0px',
            padding: '2em 0.5em',
            opacity: '0.8',
          }}
          disabled={eventIndex === eventList.length - 1}
          onClick={() => setEventIndex((index) => index + 1)}
        >
          <NavigateNextIcon />
        </Button>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column' }} ref={parent}>
        <Event
          name={translate(event.name).split(' ').slice(1).join(' ')}
          text={event.text}
          objects={event.events}
          media={event.medias}
          key={event.name}
        />
      </Box>
    </Box>
  );
};

export default EventList;