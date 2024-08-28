import { useLoaderData } from 'react-router-dom';
import { IBuilding } from '~/shared/types';
import CMap from '~/shared/ui/map/CMap';

const MapPage = () => {
  const buildings = useLoaderData() as Record<string, IBuilding>;
  return <CMap buildings={buildings} />;
};
export default MapPage;