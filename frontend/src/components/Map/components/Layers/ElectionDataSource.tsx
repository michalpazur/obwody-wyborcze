import { Source } from "react-map-gl/maplibre";
import { useElectionsStore } from "../../../../redux/electionsSlice";

export const ElectionsDataSource: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { elections } = useElectionsStore();

  return (
    <Source
      id={elections}
      key={elections}
      type="vector"
      promoteId="district"
      url={`${import.meta.env.VITE_TILE_SERVER_URL}/${elections}`}
    >
      {children}
    </Source>
  );
};
