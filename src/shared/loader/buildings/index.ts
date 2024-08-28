import { BuildingLoader, makeBuildingObjectFromPath } from './factory';

const getBuildingObjects = () =>
  Object.entries(import.meta.glob('/public/buildings/**/*')).map(([path]) =>
    makeBuildingObjectFromPath(path.replace('/public/buildings/', '')),
  );

export const getBuildings = async () => {
  const objects = getBuildingObjects();
  const buildings: Record<string, BuildingLoader> = {};
  await Promise.all(
    objects.map(async (object) => {
      if (!buildings[object.name]) {
        buildings[object.name] = new BuildingLoader(object.name);
      }
      return buildings[object.name].handleFile(object);
    }),
  );
  return buildings;
};
