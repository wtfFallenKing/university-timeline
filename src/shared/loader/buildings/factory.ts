import type { IBuilding } from '~/shared/types';

type BuildingObject = {
  name: string;
  file: string;
  path: string;
};

export const makeBuildingObjectFromPath = (path: string) => {
  const [name, file] = path.split('/');
  return { name, file, path };
};

const basePath = '/buildings/';

export class BuildingLoader implements IBuilding {
  constructor(
    public name: string,
    public text: string = '',
    public medias: string[] = [],
  ) {}

  async handleFile(file: BuildingObject) {
    if (file.file.endsWith('info.md')) {
      this.text = await (await fetch(`${basePath}${file.path}`)).text();
    } else {
      this.medias.push(`${basePath}${file.path}`);
    }
  }
}
