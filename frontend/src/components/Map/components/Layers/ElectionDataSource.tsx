import { Source } from "react-map-gl/maplibre";
import { useElectionConfig } from "../../../../utils/useElectionConfig";

export const ElectionsDataSource: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const electionConfig = useElectionConfig();
  const layer = electionConfig.layerId || electionConfig.sourceLayer;

  return (
    <Source
      id={electionConfig.id}
      key={electionConfig.id}
      type="vector"
      promoteId="district"
      url={`${import.meta.env.VITE_TILE_SERVER_URL}/${layer}`}
    >
      {children}
    </Source>
  );
};
