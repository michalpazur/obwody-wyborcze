import { Source } from "react-map-gl/maplibre";
import { useElectionsStore } from "../../../../redux/electionsSlice";
import { electionsConfig } from "../../../../config";

export const ElectionsDataSource: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { elections } = useElectionsStore();
  const selectedElections = electionsConfig[elections];

  return (
    <Source
      id={elections}
      key={elections}
      type="vector"
      promoteId="district"
      tiles={[
        `https://api.mapbox.com/v4/${
          selectedElections.tilesetId
        }/{z}/{x}/{y}.vector.pbf?access_token=${
          import.meta.env.VITE_MAPBOX_TOKEN
        }`,
      ]}
    >
      {children}
    </Source>
  );
};
