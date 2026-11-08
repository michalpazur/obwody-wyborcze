import { ExpressionSpecification } from "maplibre-gl";
import React, { useEffect, useMemo } from "react";
import { Layer, useMap } from "react-map-gl/maplibre";
import { layerIds } from "../../../../config";
import { useElectionsStore } from "../../../../redux/electionsSlice";
import { GradientOptions } from "../../../../types/colors";
import { registerTiePatterns } from "../../../../utils/createHatchPattern";
import { getTieStripes } from "../../../../utils/getTiePattern";
import { useIsLive } from "../../../../utils/useIsLive";
import { useLayerConfig } from "../../../../utils/useLayerConfig";

type TieHatchLayerProps = {
  isCounted: ExpressionSpecification;
  gradientOptions: Required<GradientOptions>;
};

const TieHatchLayer: React.FC<TieHatchLayerProps> = ({
  isCounted,
  gradientOptions,
}) => {
  const map = useMap();
  const { elections } = useElectionsStore();
  const isLive = useIsLive();
  const layerConfig = useLayerConfig();

  useEffect(() => {
    if (map.current) {
      registerTiePatterns(map.current.getMap());
    }
  }, []);

  const hatch = useMemo(() => {
    return getTieStripes(elections, isLive, gradientOptions);
  }, [elections, gradientOptions]);

  const opacity: ExpressionSpecification = isLive
    ? ["case", isCounted, hatch.opacity, 0]
    : hatch.opacity;

  return (
    <Layer
      id={layerIds.electionsTie}
      source={layerConfig.sourceLayer}
      source-layer={layerConfig.sourceLayer}
      beforeId={layerIds.water}
      type="fill"
      paint={{
        "fill-pattern": hatch.pattern,
        "fill-opacity": opacity,
        "fill-pattern-transition": { duration: 0 },
      }}
    />
  );
};

export default TieHatchLayer;
