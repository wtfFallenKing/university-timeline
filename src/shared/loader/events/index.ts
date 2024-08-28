import { EventLoader, makeEventObjectFromPath } from './factory';

const getEventObjects = () =>
  Object.entries(import.meta.glob('/public/events/**/*')).map(([path]) =>
    makeEventObjectFromPath(path.replace('/public/events/', '')),
  );

export const getEvents = async (): Promise<EventLoader[]> => {
  const objects = getEventObjects();
  const events: Record<string, EventLoader> = {};
  await Promise.all(
    objects.map(async (object) => {
      if (!events[object.name]) {
        events[object.name] = new EventLoader(object.name);
      }
      return await events[object.name].handleFile(object);
    }),
  );

  return Object.values(events);
};
