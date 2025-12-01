import { Source } from "react-map-gl/maplibre";

export const featuresSourceId = "features-source";

const FeaturesSource: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  return (
    <Source
      id={featuresSourceId}
      url="https://tiles.openfreemap.org/planet"
      type="vector"
    >
      {children}
    </Source>
  );
};

export default FeaturesSource;
