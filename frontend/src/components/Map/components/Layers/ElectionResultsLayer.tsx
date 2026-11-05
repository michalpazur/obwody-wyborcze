import { ExpressionSpecification } from "maplibre-gl";
import { useMemo } from "react";
import { Layer } from "react-map-gl/maplibre";
import { layerIds, mapOpacity, notCountedColor } from "../../../../config";
import { useElectionsStore } from "../../../../redux/electionsSlice";
import {
  generateFillColors,
  getWinnerFillColors,
} from "../../../../utils/generateFillColors";
import { getCandidateConfig } from "../../../../utils/getCandidateConfig";
import { getGradientOptions } from "../../../../utils/getGradientOptions";
import { getTurnoutColorConfig } from "../../../../utils/getTurnoutColorConfig";
import { useIsLive } from "../../../../utils/useIsLive";
import { useLayerConfig } from "../../../../utils/useLayerConfig";
import { ElectionsDataSource } from "./ElectionDataSource";

const isCounted: ExpressionSpecification = [
  "to-boolean",
  ["feature-state", "counted"],
];

const ElectionsResultsLayer: React.FC = () => {
  const { candidate, elections, showTurnout } = useElectionsStore();
  const gradientOptions = getGradientOptions(showTurnout, candidate, elections);
  const layerConfig = useLayerConfig();
  const isLive = useIsLive();

  const fillExpression = useMemo(() => {
    if (showTurnout) {
      const config = getTurnoutColorConfig(elections);

      return generateFillColors("turnout", isLive, config, gradientOptions);
    }

    if (candidate === "all") {
      return getWinnerFillColors(elections, isLive, gradientOptions);
    }

    const gradientArr = generateFillColors(
      `${candidate}_proc`,
      isLive,
      getCandidateConfig(candidate, elections),
      gradientOptions,
    );

    return [
      "case",
      ["==", [isLive ? "feature-state" : "get", candidate], null],
      notCountedColor,
      gradientArr,
    ] as ExpressionSpecification;
  }, [gradientOptions, isLive]);

  const fill = useMemo(() => {
    if (!isLive) {
      return fillExpression;
    }

    return [
      "case",
      isCounted,
      fillExpression,
      notCountedColor,
    ] as ExpressionSpecification;
  }, [fillExpression, isLive]);

  return (
    <ElectionsDataSource>
      <Layer
        id={layerIds.elections}
        source={layerConfig.sourceLayer}
        source-layer={layerConfig.sourceLayer}
        beforeId={layerIds.water}
        type="fill"
        paint={{ "fill-color": fill, "fill-opacity": mapOpacity }}
      />
    </ElectionsDataSource>
  );
};

export default ElectionsResultsLayer;
