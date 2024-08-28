import type { IEvent } from '~/shared/types';

const basePath = '/events/';

type EventObject = {
  name: string;
  file: string;
  path: string;
};

export const makeEventObjectFromPath = (path: string) => {
  const [name, file] = path.split('/');
  return { name, file, path };
};

export class EventLoader implements IEvent {
  constructor(
    public name: string,
    public text: string = '',
    public events: { year: string; name: string }[] = [],
    public medias: string[] = [],
  ) {}

  async handleFile(file: EventObject) {
    if (file.file.endsWith('text.md')) {
      this.text = await (await fetch(`${basePath}${file.path}`)).text();
    } else if (file.file.endsWith('events.json')) {
      this.events = await (await fetch(`${basePath}${file.path}`)).json();
    } else {
      this.medias.push(`${basePath}${file.path}`);
    }
  }
}
