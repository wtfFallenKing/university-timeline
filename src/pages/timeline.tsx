import { useLoaderData } from 'react-router-dom';
import { IEvent } from '~/shared/types';
import EventList from '~/shared/ui/events/EventList';

export default function TimeLinePage() {
  const events = useLoaderData() as IEvent[];
  return <EventList events={events} />;
}