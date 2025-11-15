import { Source } from "react-map-gl/maplibre";

const FeaturesSource: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  return (
    <Source
      id="maptiler-source"
      tiles={[
        `https://api.maptiler.com/tiles/v3/{z}/{x}/{y}.pbf?key=${
          import.meta.env.VITE_MAPTILER_TOKEN
        }`,
      ]}
      type="vector"
    >
      {children}
    </Source>
  );
};

export default FeaturesSource;
